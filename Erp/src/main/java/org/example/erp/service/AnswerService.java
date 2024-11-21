package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.repository.AnswersRepository;
import org.example.erp.repository.EmployeeRepository;
import org.example.erp.repository.QuestionsRepository;
import org.example.erp.repository.UsersRepository;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class AnswerService {
    private final AnswersRepository answersRepository;
    private final QuestionsRepository questionsRepository;
    private final EmployeeRepository employeeRepository;
    private final UsersRepository usersRepository;
    

    //질문 전체 리스트 불러오기 기능

    //질문 답변 리스트 불러오기 기능

    //질문 상세페이지

    //답변 리스트 불러오기기능(상세페이지에서)

    //질문 생성로직(관리자 필요한가?)

    //질문 변경로직?

    //질문 삭제로직

    //답변 생성로직

    //답변 변경로직

    //답변 삭제로직





}
