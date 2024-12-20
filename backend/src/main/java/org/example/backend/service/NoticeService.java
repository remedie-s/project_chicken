package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.entity.Notice;
import org.example.backend.repository.NoticeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;


    // 공지사항 공용,쇼핑몰 페이지만 조회
    public List<Notice> findByType() {
        List<Notice> byTypeIn = this.noticeRepository.findByTypeInOrderByIdDesc((Arrays.asList(0, 2)));
        return byTypeIn;
    }


    // 공지사항 단건 조회
    public Notice findById(long id) {
        return noticeRepository.findById(id).orElse(null);
    }

    public Object findNewest() {
        List<Notice> noticeList = this.noticeRepository.findByTypeInOrderByIdDesc((Arrays.asList(0, 2)));
        if (noticeList.isEmpty()) {
            return null;
        }
        return noticeList.get(0); // 가장 최신 항목을 반환
    }
}






