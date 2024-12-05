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
    // 문의 제목
    private String title;
    // 문의 내용
    private String content;
    private boolean answerCheck;
    // 작성일
    private LocalDateTime createTime;
    private Users users;
    private List<AnswersDto> answers;
}
