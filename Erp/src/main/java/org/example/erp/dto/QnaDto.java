package org.example.erp.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Qna관리시 사용하는 DTO
 */
@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QnaDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
}
