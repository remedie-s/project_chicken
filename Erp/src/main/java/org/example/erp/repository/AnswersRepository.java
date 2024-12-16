package org.example.erp.repository;

import org.example.erp.entity.Answers;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswersRepository extends JpaRepository<Answers, Long> {
    List<Answers> findAllByQuestions_Id(Long questionsId);
}
