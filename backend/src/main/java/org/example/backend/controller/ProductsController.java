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
import org.example.backend.service.ProductsService;
import org.example.backend.service.UsersService;
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

    //TODO Discount 할인 정책 적용시 어디서, 어떻게 적용할것인지

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

    // TODO Elastic 물품 검색


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

    // 물품 여러개 정보 조회(주문 등)
    @GetMapping("/views")
    public ResponseEntity<?> productList(@RequestBody List<Long> productIds,
                                         @AuthenticationPrincipal Users users) {
        List<ProductsDto> productsDtoList = this.productsService.productsDtoList(productIds);
        if (productsDtoList == null) {
            return ResponseEntity.status(500).body("잘못된 요청입니다.");
        }
        return ResponseEntity.ok(productsDtoList);
    }

}
