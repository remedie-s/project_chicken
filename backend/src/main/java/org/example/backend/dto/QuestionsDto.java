package org.example.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.backend.entity.Answers;
import org.example.backend.entity.Users;

import java.time.LocalDateTime;
import java.util.List;

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
    private Users users;


}
