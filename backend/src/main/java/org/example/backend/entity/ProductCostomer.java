package org.example.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class ProductCostomer {
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
