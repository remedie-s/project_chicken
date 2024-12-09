package org.example.erp.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRooms chatRoom;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;
    // 메시지 내용
    private String message;

    // 메시지 타입 (입장 enter, 퇴장 leave, 채팅 text)
    private String messageType;
    // 메시지 작성 시간
    private LocalDateTime createdAt;
}