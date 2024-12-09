package org.example.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// 채팅 메세지 작성시 사용하는 Dto
public class ChatMessageRequest {
    private Long chatRoomId;
    private String message;
}