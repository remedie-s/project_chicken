package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class ProductReviews {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // 리뷰 내용
    private String content;
    // 별점
    private float rating;
    // 리뷰 작성일
    private LocalDateTime createdAt;

    @ManyToOne
    private Users users;
    @ManyToOne
    private Products products;

}
