package org.example.backend.repository;

import org.example.backend.entity.Answers;
import org.example.backend.entity.Questions;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answers,Long> {
    List<Answers> findByQuestions(Questions questions);
    List<Answers> findByQuestionsId(Long questionsId);
}
