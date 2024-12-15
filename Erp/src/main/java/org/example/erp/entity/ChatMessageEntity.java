package org.example.erp.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class ChatMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sender;

    private String receiver; // 수신자 (1:1 메시지를 위한 필드)

    @Column(columnDefinition = "TEXT")
    private String content;

    private boolean isRead; // 읽음 상태
    private LocalDateTime timestamp; // 메시지 전송 시간
}
