package org.example.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.erp.entity.Products;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductsKafkaDto {
    private Long id;
    private String name;
    private Long price;
    private Long stock;
    private String category;
    private String brand;
    private LocalDateTime createdAt;
    private Long mainItemNumber;
    public static ProductsKafkaDto toKafkaDto(Products products) {
        return ProductsKafkaDto.builder()
                .id(products.getId())
                .name(products.getName())
                .price(products.getPrice())
                .stock(products.getStock())
                .category(products.getCategory())
                .brand(products.getBrand())
                .createdAt(products.getCreatedAt())
                .mainItemNumber(products.getMainItemNumber())
                .build();
    }
}
