package org.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KafkaProductReviewMessage {
    private String action; // register, update, delete
    private Long id;       // 리뷰 아이디
    private Products products;
    private LocalDateTime createdAt;
    private Users user;
    private float rating;
    private String content;

}