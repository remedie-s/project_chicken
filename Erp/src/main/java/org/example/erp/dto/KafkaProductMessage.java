package org.example.erp.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class KafkaProductMessage {
    private String action; // register, update, delete
    private Long id;       // Product ID
    private String name;
    private String description;
    private Long price;
    private String category;
    private String imageUrl;
    private Long stock;
    private String brand;
    private Long cost;
}
