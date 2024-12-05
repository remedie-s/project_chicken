package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.ProductReviewsDto;
import org.example.backend.entity.ProductReviews;
import org.example.backend.entity.Users;
import org.example.backend.service.ProductReviewsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/product/reviews")
public class ProductReviewsController {
    private final ProductReviewsService productReviewsService;

    // 물품 리뷰리스트
    @GetMapping("/list/{productId}")
    public ResponseEntity<List<ProductReviewsDto>> reviewsList(@PathVariable Long productId) {
        List<ProductReviewsDto> productReviews = this.productReviewsService.reviewsList(productId);
        return ResponseEntity.ok(productReviews);
    }

    // 물품 리뷰 등록
    @PostMapping("/create/{productId}")
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
        if (!this.productReviewsService.createReview(productReviewsDto, users)) {
            log.error("리뷰 생성에 실패했습니다.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)  // 500 Internal Server Error 상태 코드
                    .body("리뷰 생성에 실패했습니다.");  // 오류 메시지
        }

        // 리뷰 리스트 반환
        List<ProductReviewsDto> productReviews = this.productReviewsService.reviewsList(productReviewsDto.getProductId());
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
        if (!this.productReviewsService.modifyReview(productReviewsDto, reviewId)) {
            log.error("리뷰 생성에 실패했습니다.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)  // 500 Internal Server Error 상태 코드
                    .body("리뷰 생성에 실패했습니다.");  // 오류 메시지
        }

        // 리뷰 리스트 반환
        List<ProductReviewsDto> productReviews = this.productReviewsService.reviewsList(productReviewsDto.getProductId());
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
        if (!this.productReviewsService.deleteReview(productReviewsDto, reviewId)) {
            log.error("리뷰 생성에 실패했습니다.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)  // 500 Internal Server Error 상태 코드
                    .body("리뷰 생성에 실패했습니다.");  // 오류 메시지
        }

        // 리뷰 리스트 반환
        List<ProductReviewsDto> productReviews = this.productReviewsService.reviewsList(productReviewsDto.getProductId());
        return ResponseEntity.ok(productReviews);
    }


}
