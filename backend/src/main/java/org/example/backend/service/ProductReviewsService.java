package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.ProductReviewsDto;
import org.example.backend.dto.ProductsDto;
import org.example.backend.entity.ProductReviews;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;
import org.example.backend.repository.ProductReviewsRepository;
import org.example.backend.repository.ProductsRepository;
import org.example.backend.utility.KafkaMessage;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
@Slf4j
public class ProductReviewsService {
    private final ProductReviewsRepository productReviewsRepository;
    private final KafkaMessage kafkaMessage;
    private final ProductsRepository productsRepository;
    private final ProductsService productsService;
    private final UsersService usersService;


    // ProductReviewsDto로 변경
    public ProductReviewsDto productsReviewToDto(ProductReviews productReviews) {
        ProductReviewsDto productReviewsDto = new ProductReviewsDto();
        productReviewsDto.setId(productReviews.getId());
        productReviewsDto.setContent(productReviews.getContent());
        productReviewsDto.setRating(productReviews.getRating());
        productReviewsDto.setCreatedAt(productReviews.getCreatedAt());
        productReviewsDto.setUsersDto(usersService.getUserDetailDto(productReviews.getUsers()));
        productReviewsDto.setProductsDto(productsService.productsDetailDto(productReviews.getId()));
        return productReviewsDto;
    }

    // List<ProductReviews>를 List<ProductReviewsDto>로 전환
    public List<ProductReviewsDto> productReviewListToDtoList(List<ProductReviews> productReviewsList) {
        List<ProductReviewsDto> productReviewsDtoList = new ArrayList<>();
        for (ProductReviews productReviews : productReviewsList) {
            productReviewsDtoList.add(productsReviewToDto(productReviews));
        }
        return productReviewsDtoList;
    }

    //물품 리뷰 리스트 (물품 상세페이지)
    public List<ProductReviewsDto> reviewsList(Long productId) {
        List<ProductReviews> byProductsId = this.productReviewsRepository.findByProducts_id(productId);
        return productReviewListToDtoList(byProductsId);
    }

    // 물품 정보 획득
    public Products getProductsById(Long productId) {
    Optional<Products> products = this.productsRepository.findById(productId);
        if(products.isEmpty()){
        log.warn("Product with ID {} not found", productId);
        return null;
    }
        return products.get();
}
    // 리뷰 정보 획득
    public ProductReviews getProductReviewsById(Long productReviewsId) {
        Optional<ProductReviews> review = this.productReviewsRepository.findById(productReviewsId);
        if (review.isEmpty()) {
            log.warn("Product with ID {} not found", productReviewsId);
            return null;
        }
        return review.get();
    }
    //물품 리뷰 작성 로직
    public boolean createReview(Long productId, ProductReviewsDto productReviewsDto, Users users) {
        Products product = getProductsById(productId);
        ProductReviews review = new ProductReviews();
        review.setProducts(product);
        review.setUsers(users);
        review.setCreatedAt(LocalDateTime.now());
        review.setContent(productReviewsDto.getContent());
        review.setRating(productReviewsDto.getRating());
        this.productReviewsRepository.save(review);
        log.info("{}번 물품에 대한 리뷰가 등록되었습니다.", productId);
        // 리뷰 평점이 3.0 보다 낮으면 메시지 발송
        if(review.getRating()<=3.0){
            this.kafkaMessage.sendKafkaProductReviewMsg(review, "review");
        }
        return true;
    }

    //물품 리뷰 변경 로직
    public boolean modifyReview(ProductReviewsDto productReviewsDto,Long reviewId) {
        ProductReviews reviews = getProductReviewsById(reviewId);
        reviews.setRating(productReviewsDto.getRating());
        reviews.setContent(productReviewsDto.getContent());
        log.info("{}번 물품에 대한 리뷰가 수정되었습니다.", reviewId);
        this.productReviewsRepository.save(reviews);
        // 리뷰 평점이 3.0 보다 낮으면 메시지 발송
        if(reviews.getRating()<=3.0){
            this.kafkaMessage.sendKafkaProductReviewMsg(reviews, "review");
        }
        return true;
    }

    //물품 리뷰 삭제 로직
    public boolean deleteReview(Long reviewId) {
        ProductReviews reviews = getProductReviewsById(reviewId);
        this.productReviewsRepository.delete(reviews);
        return true;
    }

}
