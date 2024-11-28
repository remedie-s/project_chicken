package org.example.erp.dto;
import lombok.Builder;
import lombok.Data;
import org.example.erp.entity.Products;
import org.example.erp.entity.Users;

import java.time.LocalDateTime;

@Data
@Builder
public class KafkaProductReviewMessage {
    private String action;
    private Long id;
    private String content;
    private Users user;
    private LocalDateTime createdAt;
    private Integer rating;
    private Products products;
}