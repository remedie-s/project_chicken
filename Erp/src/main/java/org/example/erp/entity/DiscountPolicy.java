package org.example.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DiscountPolicy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // 대상 유저 그레이드
    private String userGrade;
    @ManyToOne
    private Event event;
    // 할인율
    private Long discountRate;
    // 시작 시간
    private LocalDateTime startTime;
    // 만료 시간
    private LocalDateTime endTime;

}

