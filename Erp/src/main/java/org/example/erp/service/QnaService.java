package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.entity.Qna;
import org.example.erp.repository.QnaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class QnaService {
    private final QnaRepository qnaRepository;
    
    //TODO 권한에따라 큐엔에이 관리 넣을것인가
    
    // 큐엔에이 등록 메소드
    public Qna save(Qna qna) {
        return qnaRepository.save(qna);
    }

    // 큐엔에이 수정 메소드
    public List<Qna> findAll() {
        return qnaRepository.findAll();
    }

    public Qna findById(Long id) {
        Optional<Qna> byId = this.qnaRepository.findById(id);
        return byId.orElse(null);
    }
    public boolean modify(Qna qna) {
        if(qna == null) {
            return false;
        }
        this.qnaRepository.save(qna);
        return true;
    }
    // 큐엔에이 삭제 메소드
    public boolean delete(Long id) {

        this.qnaRepository.deleteById(id);
        return true;
    }

}
