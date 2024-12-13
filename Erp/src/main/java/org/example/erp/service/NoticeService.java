package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.NoticeDto;
import org.example.erp.entity.Notice;
import org.example.erp.repository.NoticeRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
@Slf4j
@RequiredArgsConstructor
@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;

    // 공지사항 등록
    public boolean noticeCreate(NoticeDto noticeDto) {
        try {
            Notice notice = new Notice();
            BeanUtils.copyProperties(noticeDto, notice);
            noticeRepository.save(notice);
            return true;
        } catch (Exception e) {
            log.error("공지사항 등록 실패", e);
            return false;
        }
    }

    // 공지사항 수정
    public boolean noticeUpdate(NoticeDto noticeDto) {
        return noticeRepository.findById(noticeDto.getId())
                .map(notice -> {
                    BeanUtils.copyProperties(noticeDto, notice);
                    notice.setUpdateTime(LocalDateTime.now());
                    noticeRepository.save(notice);
                    return true;
                })
                .orElse(false);
    }

    // 공지사항 삭제
    public boolean noticeDelete(long id) {
        return noticeRepository.findById(id)
                .map(notice -> {
                    noticeRepository.delete(notice);
                    return true;
                })
                .orElse(false);
    }

    // 공지사항 전체 조회
    public List<Notice> findAll() {
        return noticeRepository.findAll();
    }

    // 공지사항 ERP 페이지만 조회
    public List<Notice> findByType() {
        List<Notice> byTypeIn = this.noticeRepository.findByTypeIn((Arrays.asList(1, 2)));
        return byTypeIn;
    }


    // 공지사항 단건 조회
    public Notice findById(long id) {
        return noticeRepository.findById(id).orElse(null);
    }
}






