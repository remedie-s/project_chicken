package org.example.backend.dto;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;

import java.time.LocalDateTime;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviewsDto {
    private Long id;
    // 리뷰 내용
    private String content;
    // 별점
    private float rating;
    // 리뷰 작성일
    private LocalDateTime createdAt;
    private Long productId;
    private Users users;
    private Products products;

}
