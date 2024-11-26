package org.example.erp.dto;

import jakarta.persistence.*;
import lombok.*;
import org.example.erp.entity.Products;
import org.example.erp.entity.Users;

import java.time.LocalDateTime;

/**
 * 리뷰 관리시 사용하는 DTO
 */
@ToString
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

    private Users users;
    private Products products;

}
