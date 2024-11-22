package org.example.backend.dto;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.entity.Event;

import java.time.LocalDateTime;

/**
 * TODO 할인정책 엔티티인데 여기다가 할인 정책 정하면 될듯 ex) 유저 그레이드, 카테고리, 물품 아이디, 그러면 이벤트를 따로 엔티티로 뺼 필요가있나 논의 필요
 *
 *
 */
@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class DiscountPolicyDto {

    private Long id;
    // 대상 유저 그레이드
    private String userGrade;
    // 대상 카테고리
    private String category;
    // 대상 물품아이디
    private Long productId;
    private Event event;
    // 할인율
    private Long discountRate;
    // 시작 시간
    private LocalDateTime startTime;
    // 만료 시간
    private LocalDateTime endTime;

}
