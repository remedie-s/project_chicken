package org.example.erp.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.erp.entity.Answers;
import org.example.erp.entity.Users;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 질문 관리시 사용하는 DTO
 */
@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class QuestionsDto {
    private Long id;
    // 답변 주제
    private String title;
    // 답변 내용
    private String content;
    // 작성일
    private LocalDateTime createTime;
    private Long userId;


}