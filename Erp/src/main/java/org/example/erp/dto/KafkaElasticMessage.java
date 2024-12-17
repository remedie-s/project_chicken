package org.example.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.erp.entity.Products;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KafkaElasticMessage {
    private String action; // "register", "update", "delete"
    private Long id;       // 상품 ID
    private String name;   // 상품명
    private Long price;    // 상품 가격
    private Long stock;    // 상품 재고
    private String category; // 상품 카테고리
    private String brand;    // 브랜드
    private String imageUrl; // 상품 이미지
    private LocalDateTime createdAt;

    public static KafkaElasticMessage toKafkaMessage(Products products) {
        return KafkaElasticMessage.builder()
                .id(products.getId())
                .name(products.getName())
                .price(products.getPrice())
                .stock(products.getStock())
                .category(products.getCategory())
                .brand(products.getBrand())
                .imageUrl(products.getImageUrl())
                .createdAt(products.getCreatedAt())
                .build();
    }

}