package org.example.backend.dto;

import jakarta.persistence.*;
import lombok.*;
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

}
