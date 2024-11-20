package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

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
    // 이벤트 이름
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
