package org.example.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Answers {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // 답변 주제
    private String title;
    // 답변 내용
    private String content;
    private LocalDateTime createTime;

    @ManyToOne
    private Questions questions;
    @ManyToOne
    private Users users;

}
