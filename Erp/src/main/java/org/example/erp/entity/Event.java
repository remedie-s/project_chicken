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
 * 이벤트 활성화 여부 확인
 * Event 엔티티의 isActive 필드나 날짜를 기준으로 이벤트 활성화 여부를 판단.
 * 할인율 계산
 * 이벤트가 활성화되었고, 특정 회원 등급이라면 DiscountPolicy를 조회하여 할인율 적용.
 * 기본 할인율과 이벤트 할인율을 합산하거나, 특정 우선순위를 적용. 추후
 */
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // 이벤트 이름
    private String eventName;
    // 실행 여부
    private boolean active;
    // 시작 시간
    private LocalDateTime startTime;
    // 만료 시간
    private LocalDateTime endTime;

}
