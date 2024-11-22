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
public class ProductCustomersDto {
    private Long id;
    //리뷰대상 물건
    private Products products;
    //리뷰대상 유저
    private Users users;



}
