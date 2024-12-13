package org.example.erp.repository;

import org.example.erp.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByTypeIn(List<Integer> types);
}