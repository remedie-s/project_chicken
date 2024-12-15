package org.example.erp.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.ChatMessage;
import org.example.erp.entity.ChatMessageEntity;
import org.example.erp.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
@Slf4j
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;


    @MessageMapping("/chat.sendMessage")
    public void sendMessage(ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
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
        messageEntity.setTimestamp(LocalDateTime.now());

        // 메시지 저장
        chatService.saveMessage(messageEntity);

        // 공용 채팅방으로 브로드캐스트
        messagingTemplate.convertAndSend("/topic/public", message);
    }

    @MessageMapping("/chat.privateSendMessage")
    public void sendPrivateMessage(ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        log.debug("Received private message from: {}", username);

        if (username != null) {
            message.setSender(username);
        }

        log.debug("Private message content: {}", message);

        ChatMessageEntity messageEntity = new ChatMessageEntity();
        messageEntity.setSender(message.getSender());
        messageEntity.setReceiver(message.getReceiver());
        messageEntity.setContent(message.getContent());
        messageEntity.setTimestamp(LocalDateTime.now());
        chatService.saveMessage(messageEntity);

        messagingTemplate.convertAndSendToUser(
                message.getReceiver(),
                "/queue/private",
                message
        );
    }

}
