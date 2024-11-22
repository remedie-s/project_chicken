package org.example.backend.dto;

import jakarta.persistence.ManyToOne;
import lombok.*;
import org.example.backend.entity.Questions;
import org.example.backend.entity.Users;

import java.time.LocalDateTime;

@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AnswersDto {

    private Long id;
    // 답변 주제
    private String title;
    // 답변 내용
    private String content;
    private LocalDateTime createTime;


    private Questions questions;

    private Users users;
}
