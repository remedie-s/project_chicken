package org.example.erp.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class KafkaProductMessage {
    private String action;
    private Long id;
    private String name;
    private String description;
    private Long price;
    private String category;
    private String imageUrl;
    private Long stock;
    private String brand;
    private Long cost;
    private Long discount;
    private Long payPrice;
    private String address;
    private Long userId;
    private LocalDateTime createdAt;
}
