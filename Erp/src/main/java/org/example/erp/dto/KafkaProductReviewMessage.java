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

    public KafkaProductReviewMessage() {

    }

    public KafkaProductReviewMessage(String action, Long id, String content, Users user, LocalDateTime createdAt, Integer rating, Products products) {
        this.action = action;
        this.id = id;
        this.content = content;
        this.user = user;
        this.createdAt = createdAt;
        this.rating = rating;
        this.products = products;
    }
}