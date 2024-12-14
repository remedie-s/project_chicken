package org.example.erp.controller;

import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.ChatMessage;
import org.example.erp.entity.ChatMessageEntity;
import org.example.erp.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@Slf4j
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        // WebSocket 세션에서 사용자 정보 가져오기
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username != null) {
            message.setSender(username);
        }

        // 메시지를 엔티티로 변환
        ChatMessageEntity messageEntity = new ChatMessageEntity();
        messageEntity.setSender(message.getSender());
        messageEntity.setReceiver(message.getReceiver());
        messageEntity.setContent(message.getContent());
        messageEntity.setTimestamp(LocalDateTime.now()); // 메시지 전송 시간

        // 메시지 저장
        chatService.saveMessage(messageEntity);

        return message;
    }
    // 개인 채팅
    @MessageMapping("/chat.privateSendMessage")
    @SendToUser("/queue/private")
    public ChatMessage sendPrivateMessage(ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        // WebSocket 세션에서 사용자 정보 가져오기
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username != null) {
            message.setSender(username);
        }

        // 개인 채팅 저장
        ChatMessageEntity messageEntity = new ChatMessageEntity();
        messageEntity.setSender(message.getSender());
        messageEntity.setReceiver(message.getReceiver());
        messageEntity.setContent(message.getContent());
        messageEntity.setTimestamp(LocalDateTime.now());

        // 메시지 저장
        chatService.saveMessage(messageEntity);

        return message;
    }
}
