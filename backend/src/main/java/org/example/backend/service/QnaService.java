package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.entity.Qna;
import org.example.backend.repository.QnaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class QnaService {
    private final QnaRepository qnaRepository;

    // 큐엔에이 목록 불러오기 메소드
    public List<Qna> findAll() {
        return qnaRepository.findAll();
    }
    // 큐엔에이 검색? 넣을까? 굳이
    // 큐엔에이 카테고리 넣을까
}
