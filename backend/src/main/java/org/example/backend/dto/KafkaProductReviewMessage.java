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
    private String action;
    private Long id;
    private String content;
    private Long userId;
    private float rating;
    private Long productId;


}