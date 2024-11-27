package org.example.backend.dto;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.entity.Carts;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;

@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CartsDto {
    private Long id;
    private Long quantity;
    private Users users;
    private Products products;
    private Long userId;
    private Long productId;

    public static CartsDto cartsToDto(Carts carts) {
        CartsDto cartsDto = new CartsDto();
        cartsDto.setId(carts.getId());
        cartsDto.setQuantity(carts.getQuantity());
        cartsDto.setUsers(carts.getUsers());
        cartsDto.setProducts(carts.getProducts());
        return cartsDto;
    }

    public CartsDto(Long id, Long quantity, Long userId, Long productId) {
        this.id = id;
        this.quantity = quantity;
        this.userId = userId;
        this.productId = productId;
    }
}
