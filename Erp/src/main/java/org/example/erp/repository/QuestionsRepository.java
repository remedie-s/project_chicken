package org.example.erp.repository;

import org.example.erp.entity.Qna;
import org.example.erp.entity.Questions;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionsRepository extends JpaRepository<Questions, Long> {
}
