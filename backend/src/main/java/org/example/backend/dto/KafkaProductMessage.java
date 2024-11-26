package org.example.backend.dto;

import lombok.Builder;
import lombok.Data;
import org.example.backend.entity.Products;

import java.time.LocalDateTime;

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
    private String brand;
    private Long cost;
    private Long stock;
    private Long discount;
    private Long payPrice;
    private String address;
    private Long userId;
    private LocalDateTime createdAt;
    public Products toEntity() {
        Products product = new Products();
        product.setId(this.id);
        product.setName(this.name);
        product.setDescription(this.description);
        product.setPrice(this.price);
        product.setCategory(this.category);
        product.setImageUrl(this.imageUrl);
        product.setStock(this.stock);
        product.setBrand(this.brand);
        product.setCost(this.cost);
        return product;
    }
}