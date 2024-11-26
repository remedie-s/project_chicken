package org.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class EventDto {
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
