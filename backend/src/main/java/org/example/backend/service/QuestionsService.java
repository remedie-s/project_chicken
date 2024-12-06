package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.AnswersDto;
import org.example.backend.dto.QuestionsDto;
import org.example.backend.entity.Answers;
import org.example.backend.entity.Questions;
import org.example.backend.entity.Users;
import org.example.backend.repository.AnswerRepository;
import org.example.backend.repository.QuestionsRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionsService {

    private final QuestionsRepository questionsRepository;
    private final AnswerRepository answerRepository;

    // Dto로 전환
    public QuestionsDto questionsToDto(Questions questions) {
        QuestionsDto questionsDto = new QuestionsDto();
        questionsDto.setId(questions.getId());
        questionsDto.setTitle(questions.getTitle());
        questionsDto.setContent(questions.getContent());
        questionsDto.setCreateTime(questions.getCreateTime());
        questionsDto.setUserId(questionsDto.getUserId());
        if(this.answerRepository.findByQuestions(questions).isEmpty()){
            questionsDto.setAnswerCheck(false);
        } else {
            questionsDto.setAnswerCheck(true);
        }
        return questionsDto;
    }

    // List Dto로 전환
    public List<QuestionsDto> questionsListToDtoList(List<Questions> questionsList) {
        List<QuestionsDto> questionsDtoList = new ArrayList<>();
        for (Questions question : questionsList) {
            questionsDtoList.add(questionsToDto(question));
        }
        return questionsDtoList;
    }

    // 질문 목록 보기(작성자만 가능)
    public List<QuestionsDto> questionsList(Users users) {
        List<Questions> questionsList = this.questionsRepository.findByUsersId(users.getId());
        return questionsListToDtoList(questionsList);
    }
    // 질문 하나 찾기
    public Questions findQuestion(Long questionsId) {
        return this.questionsRepository.findById(questionsId).orElse(null);
    }
    // 질문 상세페이지
    public QuestionsDto questionsDetail(Users users, Long questionsId) {
        Questions questions = findQuestion(questionsId);
        if (questionUserCheck(users, questions)) {
            // 사용자가 작성한 글이 아니면 null 반환
            return null;
        }
        QuestionsDto questionsDto = questionsToDto(questions);
        if(questionsDto.isAnswerCheck()) {
            questionsDto.setAnswers(findAnswersDtoList(questionsId));
        }
        return questionsDto;
    }
    // 질문자 본인 여부 확인
    public boolean questionUserCheck(Users users,  Questions questions) {
        return questions == null || !questions.getUsers().getId().equals(users.getId());
    }
    // 질문 작성
    public boolean createQuestion(Users users, QuestionsDto questionsDto) {
        Questions questions = new Questions();
        questions.setTitle(questionsDto.getTitle());
        questions.setContent(questionsDto.getContent());
        questions.setCreateTime(LocalDateTime.now());
        questions.setUsers(users);
        Questions savedQuestion = this.questionsRepository.save(questions);
        return savedQuestion != null && savedQuestion.getId() != null;
    }

    //TODO KAFKA 작성 완료시 카프카로 메시지 보내기

    // 질문 변경
    public boolean modifyQuestions(Users users, Long questionsId, QuestionsDto questionsDto) {
      Questions questions = findQuestion(questionsId);
        if (questionUserCheck(users, questions)) {
            // 사용자가 작성한 글이 아니면 flase 반환
            return false;
        }
        if(questions==null) {return false;};
        questions.setTitle(questionsDto.getTitle());
        questions.setContent(questionsDto.getContent());
        this.questionsRepository.save(questions);
        return true;
    };
    
    // 질문 삭제
    public boolean deleteQuestions(Users users, Long questionsId) {
        Questions questions = findQuestion(questionsId);
        if (questionUserCheck(users, questions)) {
            // 사용자가 작성한 글이 아니면 flase 반환
            return false;
        }
        this.questionsRepository.deleteById(questionsId);
        // 삭제 후 남아있는지 여부 확인해서 boolean 보내줌
        return !this.questionsRepository.existsById(questionsId);
    }
    
    // 질문에 대한 답변 조회
    public List<AnswersDto> findAnswersDtoList(Long questionsId) {
        List<Answers> answersList = this.answerRepository.findByQuestionsId(questionsId);
        List<AnswersDto> answersDtoList = new ArrayList<>();
        for (Answers answer : answersList) {
            answersDtoList.add(answersToDto(answer));
        }
        return answersDtoList;
    }
    // 답변 Dto
    public AnswersDto answersToDto(Answers answers) {
        AnswersDto answersDto = new AnswersDto();
        answersDto.setId(answers.getId());
        answersDto.setTitle(answers.getTitle());
        answersDto.setContent(answers.getContent());
        answersDto.setCreateTime(answers.getCreateTime());
        return answersDto;
    }

}
