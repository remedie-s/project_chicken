package org.example.backend.repository;

import org.example.backend.entity.Answers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnswerRepository extends JpaRepository<Answers,Long> {
}
