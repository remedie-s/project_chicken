package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProductCustomers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    //리뷰대상 물건
    @ManyToOne
    private Products products;
    //리뷰대상 유저
    @ManyToOne
    private Users users;



}
