package org.example.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 재고 관리 (Kafka, FCM 활용)
 * 판매 실적 분석 (그래프 제공)
 * 상품 CRUD
 * 주문 관리 (택배 정보 팝업)
 */
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class InventoryAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Products products;

    private String alertType; // 재고 부족, 재고 초과 등
    private String message;

}
