package org.example.backend.service;

import org.example.backend.entity.Answers;
import org.example.backend.repository.AnswerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AnswerService {
    @Autowired
    private AnswerRepository answerRepository;

    public List<Answers> findAll() {
        return answerRepository.findAll();
    }
    public Optional<Answers> findById(Long id) {
        Optional<Answers> answer=this.answerRepository.findById(id);
        if(answer.isPresent()) {
            return answer;
        }
        return null;
    }
}
