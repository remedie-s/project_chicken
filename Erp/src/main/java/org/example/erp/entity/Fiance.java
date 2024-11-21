package org.example.erp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 회사 자금 및 자산 관리
 * 분기별 비용, 수익, 이익 그래프 제공
 */
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Fiance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long revenue;
    private Long expense;
    private Long profit;

    private String quarter;
    private Integer year;
}
