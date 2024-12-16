package org.example.backend.repository;

import org.example.backend.entity.Notice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByTypeIn(List<Integer> types);
    // type 지정 후 작성 시간 순에 따라 가져오기
    List<Notice> findByTypeInOrderByCreateTimeDesc(List<Integer> types);
}