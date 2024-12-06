package org.example.backend.dto;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.entity.Carts;
import org.example.backend.entity.Orders;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;

import java.time.LocalDateTime;

@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrdersDto {
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
    private Long userId;
    private Long productId;
    private Users users;
    private Products products;
    private ProductsDto productsDto;

    public OrdersDto(Long id, Long quantity, Long price, Long discount, Long payPrice, LocalDateTime createdAt, boolean available, Long invoice, String address, String status, Users users, Products products) {
        this.id = id;
        this.quantity = quantity;
        this.price = price;
        this.discount = discount;
        this.payPrice = payPrice;
        this.createdAt = createdAt;
        this.available = available;
        this.invoice = invoice;
        this.address = address;
        this.status = status;
        this.users = users;
        this.products = products;
    }


    public static OrdersDto ordersToDto(Orders orders) {
        OrdersDto ordersDto = new OrdersDto();
        ordersDto.setId(orders.getId());
        ordersDto.setQuantity(orders.getQuantity());
        ordersDto.setPrice(orders.getPrice());
        ordersDto.setDiscount(orders.getDiscount());
        ordersDto.setPayPrice(orders.getPayPrice());
        ordersDto.setCreatedAt(orders.getCreatedAt());
        ordersDto.setAvailable(orders.isAvailable());
        ordersDto.setInvoice(orders.getInvoice());
        ordersDto.setAddress(orders.getAddress());
        ordersDto.setStatus(orders.getStatus());
        ordersDto.setUsers(orders.getUsers());
        ordersDto.setProductsDto(ProductsDto.productsEntityToDto(orders.getProducts()));
        return ordersDto;
    }

    // DTO -> 엔티티 변환 메소드
    public Orders toEntity() {
        return new Orders(
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
