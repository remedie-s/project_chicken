package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // 주문수량
    private Long quantity;
    // 주문시 원가격
    private Long price;
    // 주문시 할인 가격
    private Long discount;
    // 주문시 실제최종 가격
    private Long payPrice;
    // 주문일자
    private LocalDateTime createdAt;
    // 숨김여부(기본 false)
    private boolean available;
    // 배송번호(운송장번호)
    private Long invoice;
    // 배송지
    private String address;

    @ManyToOne
    private Users users;
    @ManyToOne
    private Products products;

}
