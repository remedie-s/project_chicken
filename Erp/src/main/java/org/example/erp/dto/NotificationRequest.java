package org.example.erp.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class NotificationRequest {
    private Long userId ;   // FCM 토큰 (푸시 알림을 받을 대상)
    private String title;   // 푸시 알림의 제목
    private String body;    // 푸시 알림의 본문
}
