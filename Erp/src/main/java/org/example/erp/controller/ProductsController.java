package org.example.erp.controller;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.ProductsDto;
import org.example.erp.entity.Employee;
import org.example.erp.entity.ProductReviews;
import org.example.erp.service.ProductsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 물품 관리 컨트롤러
 */
@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/products")
public class ProductsController {
    private final ProductsService productsService;

    // 물품 등록
    @PostMapping("/create")
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductsDto productsDto ) {
        log.info("createProduct: {}", productsDto.getName());
        this.productsService.registerProduct(productsDto);

        return ResponseEntity.ok(productsDto);
    }
    // 물품 수정
    @PutMapping("/{productId}")
    public ResponseEntity<?> updateProduct(@PathVariable("productId") Long productId,@Valid @RequestBody ProductsDto productsDto) {
        boolean updated = productsService.updateProduct(productsDto);
        if (updated) {
            return ResponseEntity.ok("Product updated successfully");
        }
        return ResponseEntity.badRequest().body("Product update failed");
    }

    // 물품 삭제
    @DeleteMapping("/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable("productId") Long productId) {
        boolean deleted = productsService.deleteProduct(productId);
        if (deleted) {
            return ResponseEntity.ok("Product deleted successfully");
        }
        return ResponseEntity.badRequest().body("Product delete failed");
    }

    // 물품 전체 리스트 조회
    @GetMapping("/all")
    public ResponseEntity<List<ProductsDto>> getAllProducts() {
        List<ProductsDto> products = productsService.findAll();
        return ResponseEntity.ok(products);
    }

    // 물품 카테고리별 리스트 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ProductsDto>> getProductsByCategory(@PathVariable String category) {
        List<ProductsDto> products = productsService.findByCategory(category);
        return ResponseEntity.ok(products);
    }

    // 물품 이벤트별 리스트 조회
    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<ProductsDto>> getProductsByEvent(@PathVariable Long eventId) {
        List<ProductsDto> products = productsService.findByEvent(eventId);
        return ResponseEntity.ok(products);
    }

    // 물품 상세 정보 조회
    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductDetails(@PathVariable Long productId) {
        ProductsDto product = productsService.findById(productId);
        if (product != null) {
            return ResponseEntity.ok(product);
        }
        return ResponseEntity.badRequest().body("Product not found");
    }

    // 물품 리뷰 리스트 조회
    @GetMapping("/review/{productId}")
    public ResponseEntity<?> getReview(@PathVariable Long productId) {
        List<ProductReviews> reviews = this.productsService.reviews(productId);
        if (reviews != null) {
            return ResponseEntity.ok(reviews);
        }
        reviews.add(0, new ProductReviews());
        return ResponseEntity.ok(reviews);
    }
    // 물품 리뷰 리스트 삭제
    @DeleteMapping("/review/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        if(this.productsService.reviewDelete(id)){
            return ResponseEntity.ok("Review deleted successfully");
        }
        return ResponseEntity.badRequest().body("Review delete failed");
    }



}

