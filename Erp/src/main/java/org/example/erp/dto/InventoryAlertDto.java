package org.example.erp.dto;

import jakarta.persistence.*;
import lombok.*;
import org.example.erp.entity.Products;

/**
 * 재고 관리 (Kafka, FCM 활용)
 * 판매 실적 분석 (그래프 제공)
 * 상품 CRUD
 * 주문 관리 (택배 정보 팝업)
 */
@Setter
@Getter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class InventoryAlertDto {


    private Long id;
    private Products products;
    private String alertType; // 재고 부족, 재고 초과 등
    private String message;

}
