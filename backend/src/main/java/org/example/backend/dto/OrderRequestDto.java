package org.example.backend.dto;

import lombok.*;

@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequestDto {
    private ProductsDto productsDto;
    private Long quantity;
}
