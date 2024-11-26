package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.repository.AnswerRepository;
import org.example.backend.repository.QuestionsRepository;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionsService {

    private final QuestionsRepository questionsRepository;
    private final AnswerRepository answerRepository;
    
    // 질문 목록 보기(작성자만 가능)
    
    // 질문 상세페이지
    
    // 질문 작성

    //TODO KAFKA 작성 완료시 카프카로 메시지 보내기

    // 질문 변경
    
    // 질문 삭제
    
    // 답변 작성
    
    // 답변 변경(관리자만가능)
    
    // 답변 삭제(관리자만가능)
    

}
