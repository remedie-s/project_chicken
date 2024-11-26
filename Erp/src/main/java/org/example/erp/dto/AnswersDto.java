package org.example.erp.dto;

import jakarta.persistence.ManyToOne;
import lombok.*;
import org.example.erp.entity.Questions;
import org.example.erp.entity.Users;

import java.time.LocalDateTime;

/**
 * 답변시 사용하는 DTO
 */
@Getter
@Setter
@ToString
@NoArgsConstructor

@AllArgsConstructor
public class AnswersDto {

    private Long id;


    private String title;
    private String content;
    private LocalDateTime createTime;
    private Questions questions;
    private Users users;

    public AnswersDto(String title, String content, LocalDateTime createTime, Questions questions, Users users) {
        this.title = title;
        this.content = content;
        this.createTime = createTime;
        this.questions = questions;
        this.users = users;
    }
}
