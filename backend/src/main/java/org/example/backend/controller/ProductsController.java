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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
    
    //TODO Discount 할인 정책 적용시 어디서, 어떻게 적용할것인지
    
    // 물품 목록
    @GetMapping("/all")
    public ResponseEntity<List<Products>> getAllProducts() {
        return ResponseEntity.ok(this.productsService.allList());
    }

    // TODO Elastic 물품 검색



    // 물품 상세페이지
    @GetMapping("/detail/{productId}")
    public ResponseEntity<ProductsDto> getProductById(@PathVariable Long productId) {
           return ResponseEntity.ok(this.productsService.productsDetail(productId));
    }

    // 물품 카트 등록
    @PostMapping("/cart")
    public ResponseEntity<?> productToCart(@RequestBody @Valid CartsDto cartsDto,
                                           @AuthenticationPrincipal Users users) {
        if(cartsDto.getUserId()!=users.getId()){
            log.error("로그인한 유저와 요청 유저가 다릅니다.");
            return ResponseEntity.status(500).body("로그인한 유저와 요청 유저가 다릅니다.");
        }
        Map<String, Object> responseBody = new HashMap<>();
        if(this.productsService.moveToCart(cartsDto, users)){
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
        if(ordersDto.getUserId()!=users.getId()){
            log.error("로그인한 유저와 요청 유저가 다릅니다.");
            return ResponseEntity.status(500).body("로그인한 유저와 요청 유저가 다릅니다.");
        }
        Map<String, Object> responseBody = new HashMap<>();
        if(this.productsService.buyInstance(ordersDto, users)){
            responseBody.put("success", true);
            responseBody.put("userId", users.getId());
            responseBody.put("productId", ordersDto.getId());
            return ResponseEntity.ok(responseBody);
        }
        return ResponseEntity.status(500).body("주문 등록 오류입니다.");
    }

    // 물품 리뷰리스트
    @GetMapping("/reviewList")
    public ResponseEntity<List<ProductReviews>> reviewsList(Long productId) {
        List<ProductReviews> productReviews = this.productsService.reviewsList(productId);
        return ResponseEntity.ok(productReviews);
    }

    // 물품 리뷰 등록
    @PostMapping("/review/create")
    public ResponseEntity<?> createReview(@Valid @RequestBody 
                                              ProductReviewsDto productReviewsDto,
                                              @AuthenticationPrincipal Users users) {
        // 로그인한 유저와 요청한 유저가 다를 경우
        if(productReviewsDto.getUserId()!=users.getId()){
            log.error("로그인한 유저와 요청 유저가 다릅니다.");
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)  // 403 Forbidden 상태 코드
                    .body("로그인한 유저와 요청 유저가 다릅니다.");  // 오류 메시지
        }

        // 리뷰 생성 실패 시
        if (!this.productsService.createReview(productReviewsDto, users)) {
            log.error("리뷰 생성에 실패했습니다.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)  // 500 Internal Server Error 상태 코드
                    .body("리뷰 생성에 실패했습니다.");  // 오류 메시지
        }

        // 리뷰 리스트 반환
        List<ProductReviews> productReviews = this.productsService.reviewsList(productReviewsDto.getProductId());
        return ResponseEntity.ok(productReviews);
    }
    
    // 물품 리뷰 변경
    @PostMapping("/review/modify/{reviewId}")
    public ResponseEntity<?> modifyReview(@PathVariable Long reviewId,
                                          @Valid @RequestBody
                                          ProductReviewsDto productReviewsDto,
                                          @AuthenticationPrincipal Users users) {
        // 로그인한 유저와 요청한 유저가 다를 경우
        if(productReviewsDto.getUserId()!=users.getId()){
            log.error("로그인한 유저와 요청 유저가 다릅니다.");
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)  // 403 Forbidden 상태 코드
                    .body("로그인한 유저와 요청 유저가 다릅니다.");  // 오류 메시지
        }
        // 리뷰 변경 실패 시
        if (!this.productsService.modifyReview(productReviewsDto, reviewId)) {
            log.error("리뷰 생성에 실패했습니다.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)  // 500 Internal Server Error 상태 코드
                    .body("리뷰 생성에 실패했습니다.");  // 오류 메시지
        }

        // 리뷰 리스트 반환
        List<ProductReviews> productReviews = this.productsService.reviewsList(productReviewsDto.getProductId());
        return ResponseEntity.ok(productReviews);
    }
    
    // 물품 리뷰 삭제
    @PostMapping("/review/delete/{reviewId}")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId,
                                          @Valid @RequestBody
                                          ProductReviewsDto productReviewsDto,
                                          @AuthenticationPrincipal Users users) {
        // 로그인한 유저와 요청한 유저가 다를 경우
        if(productReviewsDto.getUserId()!=users.getId()){
            log.error("로그인한 유저와 요청 유저가 다릅니다.");
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)  // 403 Forbidden 상태 코드
                    .body("로그인한 유저와 요청 유저가 다릅니다.");  // 오류 메시지
        }
        // 리뷰 변경 실패 시
        if (!this.productsService.deleteReview(productReviewsDto, reviewId)) {
            log.error("리뷰 생성에 실패했습니다.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)  // 500 Internal Server Error 상태 코드
                    .body("리뷰 생성에 실패했습니다.");  // 오류 메시지
        }

        // 리뷰 리스트 반환
        List<ProductReviews> productReviews = this.productsService.reviewsList(productReviewsDto.getProductId());
        return ResponseEntity.ok(productReviews);
    }


}
