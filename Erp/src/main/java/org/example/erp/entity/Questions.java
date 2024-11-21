package org.example.erp.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    @JsonIgnore
    @OneToMany
    private List<Answers> answers;
    @ManyToOne
    private Users users;


}