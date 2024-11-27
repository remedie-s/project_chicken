package org.example.backend.dto;

import jakarta.persistence.ManyToOne;
import lombok.*;
import org.example.backend.entity.Partner;
import org.example.backend.entity.Products;

import java.time.LocalDateTime;

/**
 * 물품 관리시 사용하는 DTO
 */
@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductsDto {
    private Long id;
    // 상품명
    private String name;
    // 상품설명
    private String description;
    // 상품가격
    private Long price;
    // 상품 생성일
    private LocalDateTime createdAt;
    // 상품 URL
    private String imageUrl;
    // 상품 재고
    private Long stock;
    // 상품 판매랑
    private Long sellCount;
    // 상품 카테고리
    private String category;
    // 메인 상품 번호 (만약 ID와 같다면 이 상품이 메인 상품)
    private Long mainItemNumber;
    // 이벤트 번호(로직 시 이벤트 번호에 따라 이벤트 작동여부? 이벤트 테이블 생성? 추후 고려해야함)
    private Integer event;
    private Partner partner;

    public static ProductsDto productsEntityToDto(Products entity) {
        ProductsDto dto = new ProductsDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setImageUrl(entity.getImageUrl());
        dto.setStock(entity.getStock());
        dto.setSellCount(entity.getSellCount());
        dto.setCategory(entity.getCategory());
        dto.setMainItemNumber(entity.getMainItemNumber());
        dto.setEvent(entity.getEvent());
        dto.setPartner(entity.getPartner()); // Partner 객체 매핑
        return dto;
    }
    public static Products productsDtoToEntity(ProductsDto dto) {
        Products product = new Products();
        product.setId(dto.getId());
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCreatedAt(dto.getCreatedAt());
        product.setImageUrl(dto.getImageUrl());
        product.setStock(dto.getStock());
        product.setSellCount(dto.getSellCount());
        product.setCategory(dto.getCategory());
        product.setMainItemNumber(dto.getMainItemNumber());
        product.setEvent(dto.getEvent());
        product.setPartner(dto.getPartner()); // Partner 객체 매핑
        return product;
    }
}
