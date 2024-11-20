package org.example.backend.repository;

import org.example.backend.entity.Qna;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QnaRepository extends JpaRepository<Qna,Long> {
}
