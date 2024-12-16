package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.AnswersDto;
import org.example.erp.dto.QuestionsDto;
import org.example.erp.entity.Answers;
import org.example.erp.entity.Questions;
import org.example.erp.entity.Users;
import org.example.erp.repository.AnswersRepository;
import org.example.erp.repository.EmployeeRepository;
import org.example.erp.repository.QuestionsRepository;
import org.example.erp.repository.UsersRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class AnswersService {
    private final AnswersRepository answersRepository;
    private final QuestionsRepository questionsRepository;
    private final UsersRepository usersRepository;
    private final EmployeeRepository employeeRepository;
    

    //질문 전체 리스트 불러오기 기능
    public List<QuestionsDto> findAllQuestions() {

        List<Questions> all = questionsRepository.findAll();
        List<QuestionsDto> dtos = new ArrayList<>();
        for (Questions q : all) {
            QuestionsDto dto = new QuestionsDto();
            dto.setId(q.getId());
            dto.setTitle(q.getTitle());
            dto.setContent(q.getContent());
            dto.setCreateTime(q.getCreateTime());
            dto.setUserId(q.getUsers().getId());
            dtos.add(dto);
        }
        return dtos;
    }

    //질문 답변 리스트 불러오기 기능
    public List<AnswersDto> findByQuestionId(Long questionId) {

        List<Answers> allByQuestionsId = answersRepository.findAllByQuestions_Id(questionId);
        List<AnswersDto> dtos = new ArrayList<>();
        for (Answers a : allByQuestionsId) {
            AnswersDto dto = new AnswersDto();
            dto.setId(a.getId());
            dto.setTitle(a.getTitle());
            dto.setContent(a.getContent());
            dto.setCreateTime(a.getCreateTime());
            dto.setUserId(a.getUsers().getId());
            dtos.add(dto);
        }
        return dtos;
    }

    //질문 상세페이지
    public QuestionsDto findByIdQuestions(Long id) {
        Optional<Questions> byId = questionsRepository.findById(id);
        if (byId.isPresent()) {
            Questions questions = byId.get();
            QuestionsDto dto = new QuestionsDto();
            dto.setId(questions.getId());
            dto.setTitle(questions.getTitle());
            dto.setContent(questions.getContent());
            dto.setCreateTime(questions.getCreateTime());
            dto.setUserId(questions.getUsers().getId());
            return dto;

        }
        return null;
    }

    //질문 생성로직(관리자 필요한가?) - 질문 생성되면 카프카로 경고 넣을지 정해야함
    public boolean saveQuestions(QuestionsDto questionsDto) {
        Questions questions = new Questions();
        questions.setTitle(questionsDto.getTitle());
        questions.setContent(questionsDto.getContent());
        questions.setCreateTime(LocalDateTime.now());
        Optional<Users> byId = usersRepository.findById(questionsDto.getUserId());
        if (byId.isPresent()) {
            Users users = byId.get();
            questions.setUsers(users);
        }
        else {
            return false;
        }
        questionsRepository.save(questions);
        return true;
    }

    //질문 변경로직? 질문 상태를 엔티티에 추가하고 완료버튼 누르면 작동하는 로직? 구매자 측에서 생성해서 카프카로 메시지
    public boolean updateQuestions(QuestionsDto questionsDto) {
        Long id = questionsDto.getId();
        Optional<Questions> byId = questionsRepository.findById(id);
        if (byId.isPresent()) {
            Questions questions = byId.get();
            questions.setTitle(questionsDto.getTitle());
            questions.setContent(questionsDto.getContent());
            this.questionsRepository.save(questions);
            return true;
        }

        return false;
    }

    //질문 삭제로직
    public boolean deleteQuestions(Long id) {
        questionsRepository.deleteById(id);
        return true;
    }


    //답변 생성 로직
    public Answers saveAnswers(Answers answers) {

        //TODO 답변 생성로직 답변 생성시 구매자에게 카프카로 메시지
        return answersRepository.save(answers);
    }

    //답변 변경로직
    public Answers updateAnswers(Answers answers) {
        return answersRepository.save(answers);
    }
    //답변 삭제로직
    public void deleteAnswers(Long id) {
        answersRepository.deleteById(id);
    }





}
