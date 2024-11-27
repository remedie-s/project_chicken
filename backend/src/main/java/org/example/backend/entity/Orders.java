package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.dto.OrdersDto;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
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
    // 주문 상태
    private String status;
    @ManyToOne
    private Users users;
    @ManyToOne
    private Products products;

    // 엔티티 -> DTO 변환 메소드
    public OrdersDto toDto() {
        return new OrdersDto(
                id,
                quantity,
                price,
                discount,
                payPrice,
                createdAt,
                available,
                invoice,
                address,
                status,
                users,
                products
        );
    }

}
