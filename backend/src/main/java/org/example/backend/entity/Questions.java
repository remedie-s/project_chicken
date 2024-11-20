package org.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.aspectj.weaver.patterns.TypePatternQuestions;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Questions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    // 답변 주제
    private String title;
    // 답변 내용
    private String content;
    // 작성일
    private LocalDateTime createTime;
    @OneToMany
    private List<Answers> answers;
    @ManyToOne
    private Users users;


}
