package org.example.erp.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 회사 자금 및 자산 관리
 * 분기별 비용, 수익, 이익 그래프 제공
 * 재산 현황에 따라 적어야할듯?
 * 아이디, 재산 명, 재산 설명, 구입 가격, 현재 가격,판매가격 ,현재 상태, 구입 일시, 판매 일시
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

    private String name;
    private String description;
    private Long buyPrice;
    private Long sellPrice;
    private Long currentPrice;
    private String status;//good normal bad
    private LocalDateTime buyTime;
    private LocalDateTime sellTime;
}
