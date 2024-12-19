package org.example.backend.controller;


import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.CartsDto;
import org.example.backend.dto.OrdersDto;
import org.example.backend.dto.ProductReviewsDto;
import org.example.backend.dto.ProductsDto;
import org.example.backend.entity.ProductReviews;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;
import org.example.backend.search.ProductDocument;
import org.example.backend.service.ProductsService;
import org.example.backend.service.UsersService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/products")
public class ProductsController {
    private final ProductsService productsService;
    private final UsersService usersService;

    // 물품 목록
    @GetMapping("/list/all")
    public ResponseEntity<List<ProductsDto>> getAllProducts() {
        return ResponseEntity.ok(this.productsService.allListDto());
    }

    // 최근 일주일 물품 목록
    @GetMapping("/list/new")
    public ResponseEntity<List<ProductsDto>> getNewProducts() {
        return ResponseEntity.ok(this.productsService.newListDto());
    }

    // 이벤트 물품 목록 (현재는 이벤트 분류 없이 이벤트 상품 다 불러옴)
    @GetMapping("/list/event")
    public ResponseEntity<List<ProductsDto>> getEventProducts() {
        return ResponseEntity.ok(this.productsService.eventListDto());
    }


    // 물품 상세페이지
    @GetMapping("/detail/{productId}")
    public ResponseEntity<ProductsDto> getProductById(
            @PathVariable Long productId) {
        return ResponseEntity.ok(this.productsService.productsDetailDto(productId));
    }

    // 물품 상세페이지
    @GetMapping("/detail/{productId}/user")
    public ResponseEntity<ProductsDto> getProductByIdAndUser(@AuthenticationPrincipal Users users,
                                                             @PathVariable Long productId) {
        return ResponseEntity.ok(this.productsService.productsDetailAndUser(productId, users));
    }

    // 물품 카트 등록
    @PostMapping("/cart")
    public ResponseEntity<?> productToCart(@RequestBody @Valid CartsDto cartsDto
    ) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        // 인증 정보가 null이거나 사용자 정보가 없는 경우
        if (authentication == null || authentication.getPrincipal() == null) {
            log.error("No authentication found or user is not logged in.");
            throw new RuntimeException("User not logged in");
        }

        String username = authentication.getName(); // 인증된 사용자의 이메일 또는 사용자명

        // username을 기반으로 Users 객체를 DB에서 조회
        Users users = this.usersService.findByEmail(username);

        if (users == null) {
            log.error("User not found: {}", username);
            throw new RuntimeException("User not found");
        }

        // user가 null이 아니면 이후 로직 수행
        log.info("User found: {}", users.getId());

        Map<String, Object> responseBody = new HashMap<>();
        if (this.productsService.moveToCart(cartsDto, users)) {
            responseBody.put("success", true);
            responseBody.put("userId", users.getId());
            responseBody.put("productId", cartsDto.getId());
            return ResponseEntity.ok(responseBody);
        }
        return ResponseEntity.status(500).body("카트 등록 오류입니다.");
    }

    // 물품 즉시구매
    @PostMapping("/buy")
    public ResponseEntity<?> productToBuy(@RequestBody @Valid OrdersDto ordersDto,
                                          @AuthenticationPrincipal Users users) {
        if (ordersDto.getUserId() != users.getId()) {
            log.error("로그인한 유저와 요청 유저가 다릅니다.");
            return ResponseEntity.status(500).body("로그인한 유저와 요청 유저가 다릅니다.");
        }
        Map<String, Object> responseBody = new HashMap<>();
        if (this.productsService.buyInstance(ordersDto, users)) {
            responseBody.put("success", true);
            responseBody.put("userId", users.getId());
            responseBody.put("productId", ordersDto.getId());
            return ResponseEntity.ok(responseBody);
        }
        return ResponseEntity.status(500).body("주문 등록 오류입니다.");
    }

    // 물품id 리스트로 받아서 물품 여러개 정보 조회(주문 등)
    @GetMapping("/views")
    public ResponseEntity<?> productList(@RequestBody List<Long> productIds,
                                         @AuthenticationPrincipal Users users) {
        List<ProductsDto> productsDtoList = this.productsService.productsDtoList(productIds);
        if (productsDtoList == null) {
            return ResponseEntity.status(500).body("잘못된 요청입니다.");
        }
        return ResponseEntity.ok(productsDtoList);
    }
    // 물품 브랜드 별 조회
    @GetMapping("/brand/{brand}")
    public ResponseEntity<List<ProductsDto>> getProductsByBrand(
            @PathVariable String brand){
        List<ProductsDto> productsDtoList = this.productsService.productsListByBrand(brand);
        return ResponseEntity.ok(productsDtoList);
    };

    // 물품 카테고리 별 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductsDto>> getProductsByCategory(
            @PathVariable String category){
        System.out.println(category);
        List<ProductsDto> productsDtoList = this.productsService.productsListByCategory(category);
        return ResponseEntity.ok(productsDtoList);
    };

    // 물품 검색 (jpa쿼리)
//    @GetMapping("/search/{keyword}")
//    public ResponseEntity<List<ProductsDto>> getProductsByKeyword(@PathVariable String keyword) {
//        return ResponseEntity.ok(this.productsService.searchProducts(keyword));
//    }

    // 물품 검색 (엘라스틱)
    @GetMapping("/search/{keyword}")
    public ResponseEntity<List<ProductDocument>> getProductsByKeyword(@PathVariable String keyword) {
        return ResponseEntity.ok(this.productsService.searchProductsByKeyword(keyword));
    }

    // 물품 검색 (엘라스틱 띄어쓰기 포함)
    @GetMapping("/search/up/{keyword}")
    public ResponseEntity<List<ProductDocument>> getProductsByKeywordUp(@PathVariable String keyword) {
        return ResponseEntity.ok(this.productsService.searchProductsByKeywordUp(keyword));
    }
    // 자동완성 엔드포인트
    @GetMapping("/autocomplete")
    public List<ProductDocument> autocomplete(@RequestParam String prefix) {
        return productsService.autocomplete(prefix);
    }
    // 카테고리 검색
    @GetMapping("/search/category")
    public ResponseEntity<List<ProductDocument>> searchProductsByCategory(@RequestParam String category) {
        try {
            List<ProductDocument> products = productsService.searchProductsByCategory(category);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by category", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 가격 범위 검색
    @GetMapping("/search/price")
    public ResponseEntity<List<ProductDocument>> searchProductsByPriceRange(@RequestParam Double minPrice,
                                                                            @RequestParam Double maxPrice) {
        try {
            List<ProductDocument> products = productsService.searchProductsByPriceRange(minPrice, maxPrice);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by price range", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 키워드와 카테고리 조합 검색
    @GetMapping("/search/category-and-keyword")
    public ResponseEntity<List<ProductDocument>> searchProductsByCategoryAndKeyword(@RequestParam String category,
                                                                                    @RequestParam String keyword) {
        try {
            List<ProductDocument> products = productsService.searchProductsByCategoryAndKeyword(category, keyword);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by category and keyword", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 여러 카테고리 검색
    @GetMapping("/search/categories")
    public ResponseEntity<List<ProductDocument>> searchProductsByCategories(@RequestParam List<String> categories) {
        try {
            List<ProductDocument> products = productsService.searchProductsByCategories(categories);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by categories", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 가격 범위와 카테고리 조합 검색
    @GetMapping("/search/category-and-price")
    public ResponseEntity<List<ProductDocument>> searchProductsByCategoryAndPriceRange(@RequestParam String category,
                                                                                       @RequestParam Double minPrice,
                                                                                       @RequestParam Double maxPrice) {
        try {
            List<ProductDocument> products = productsService.searchProductsByCategoryAndPriceRange(category, minPrice, maxPrice);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by category and price range", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 재고량 기준 검색
    @GetMapping("/search/stock/greater-than")
    public ResponseEntity<List<ProductDocument>> searchProductsByStockGreaterThanOrEqual(@RequestParam Long stock) {
        try {
            List<ProductDocument> products = productsService.searchProductsByStockGreaterThanOrEqual(stock);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by stock", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 판매량 기준 정렬된 검색 (페이징 지원)
    @GetMapping("/search/top-selling")
    public ResponseEntity<Page<ProductDocument>> getTopSellingProducts(Pageable pageable) {
        try {
            Page<ProductDocument> products = productsService.getTopSellingProducts(pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error fetching top selling products", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 복잡한 쿼리를 사용한 검색
    @GetMapping("/search/custom")
    public ResponseEntity<List<ProductDocument>> searchProductsByCustomQuery(@RequestParam String keyword,
                                                                             @RequestParam Double minPrice,
                                                                             @RequestParam Double maxPrice) {
        try {
            List<ProductDocument> products = productsService.searchProductsByCustomQuery(keyword, minPrice, maxPrice);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by custom query", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 페이징 및 정렬 지원 키워드 검색
    @GetMapping("/search/keyword")
    public ResponseEntity<Page<ProductDocument>> searchProductsByKeywordPaged(@RequestParam String keyword,
                                                                              Pageable pageable) {
        try {
            Page<ProductDocument> products = productsService.searchProductsByKeywordPaged(keyword, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by keyword", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 브랜드 기반 검색
    @GetMapping("/search/brand")
    public ResponseEntity<List<ProductDocument>> searchProductsByBrand(@RequestParam String brand) {
        try {
            List<ProductDocument> products = productsService.searchProductsByBrand(brand);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by brand", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 브랜드와 가격 범위 검색
    @GetMapping("/search/brand-and-price")
    public ResponseEntity<List<ProductDocument>> searchProductsByBrandAndPriceRange(@RequestParam String brand,
                                                                                    @RequestParam Double minPrice,
                                                                                    @RequestParam Double maxPrice) {
        try {
            List<ProductDocument> products = productsService.searchProductsByBrandAndPriceRange(brand, minPrice, maxPrice);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by brand and price range", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 브랜드와 카테고리 검색
    @GetMapping("/search/brand-and-category")
    public ResponseEntity<List<ProductDocument>> searchProductsByBrandAndCategory(@RequestParam String brand,
                                                                                  @RequestParam String category) {
        try {
            List<ProductDocument> products = productsService.searchProductsByBrandAndCategory(brand, category);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by brand and category", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 판매량 기준 상위 브랜드 검색
    @GetMapping("/search/top-selling-brand")
    public ResponseEntity<Page<ProductDocument>> getTopSellingProductsByBrand(@RequestParam String brand,
                                                                              Pageable pageable) {
        try {
            Page<ProductDocument> products = productsService.getTopSellingProductsByBrand(brand, pageable);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error fetching top selling products by brand", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 브랜드와 키워드 검색
    @GetMapping("/search/brand-and-keyword")
    public ResponseEntity<List<ProductDocument>> searchProductsByBrandAndKeyword(@RequestParam String brand,
                                                                                 @RequestParam String keyword) {
        try {
            List<ProductDocument> products = productsService.searchProductsByBrandAndKeyword(brand, keyword);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by brand and keyword", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 브랜드 목록 기반 검색
    @GetMapping("/search/brands")
    public ResponseEntity<List<ProductDocument>> searchProductsByBrands(@RequestParam List<String> brands) {
        try {
            List<ProductDocument> products = productsService.searchProductsByBrands(brands);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            log.error("Error searching products by brands", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
