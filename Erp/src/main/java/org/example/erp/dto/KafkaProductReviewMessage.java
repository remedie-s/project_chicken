package org.example.erp.dto;
import lombok.Builder;
import lombok.Data;
import org.example.erp.entity.Products;
import org.example.erp.entity.Users;

import java.time.LocalDateTime;

@Data
@Builder
public class KafkaProductReviewMessage {
    private String name;
    private String action;
    private Long id;
    private String content;
    private Long userId;
    private float rating;
    private Long productID;

    public KafkaProductReviewMessage() {

    }

    public KafkaProductReviewMessage(String action,String name, Long id, String content, Long userId, float rating, Long productID) {

        this.action = action;
        this.name = name;
        this.id = id;
        this.content = content;
        this.userId = userId;
        this.rating = rating;
        this.productID = productID;
    }
}