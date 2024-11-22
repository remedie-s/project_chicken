package org.example.erp.dto;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 주요 기능
 * 공지사항 CRUD
 * 권한에 따른 접근 제어 (관리자만 등록/수정 가능)
 */
@ToString
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class NoticeDto {

    private Long id;
    // 공지사항 주제
    private String title;
    // 공지사항 컨텐츠
    private String content;
    // 공지사항에 이미지 유알엘이 있다면 유알엘
    private String imageUrl;
    // 사내 공지사항, 일반 사용자용 알림사항등 타입
    private String type;
    // 생성일
    private LocalDateTime createTime;
    // 갱신일
    private LocalDateTime updateTime;
    // 만료일
    private LocalDateTime deleteTime;
    //유저아이디와 연결? 안해도될듯
}
