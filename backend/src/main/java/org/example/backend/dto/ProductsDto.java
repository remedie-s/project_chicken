package org.example.backend.dto;

import jakarta.persistence.ManyToOne;
import lombok.*;
import org.example.backend.entity.Partner;

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
}
