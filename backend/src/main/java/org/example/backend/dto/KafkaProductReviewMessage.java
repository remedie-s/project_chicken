package org.example.backend.dto;

import lombok.Builder;
import lombok.Data;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;

import java.time.LocalDateTime;

@Data
@Builder
public class KafkaProductReviewMessage {
    private String action; // register, update, delete
    private Long id;       // 리뷰 아이디
    private Products products;
    private LocalDateTime createdAt;
    private Users user;
    private float rating;
    private String content;

}