package org.example.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// 메세지 전파, 게시용 dto
public class ChatMessagesDto {
    private Long chatRoomId;
    private Long employeeId;
    private String message;
    private String name;
    private LocalDateTime createdAt;
    private String messageType;

    // Constructor, Getter, Setter
}

