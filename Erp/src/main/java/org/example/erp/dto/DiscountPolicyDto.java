package org.example.erp.dto;

import lombok.*;
import org.example.erp.entity.Event;

import java.time.LocalDateTime;
/**
 * 할인율 관리시 사용하는 DTO
 */
@Getter
@Setter
@ToString
@NoArgsConstructor

@AllArgsConstructor
public class DiscountPolicyDto {

    private Long id;
    private String userGrade;
    private String category;
    private Event event;
    private Long discountRate;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
