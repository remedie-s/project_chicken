package org.example.erp.config;

import org.example.erp.dto.ChatMessagesDto;
import org.example.erp.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    @Autowired
    private WebSocketService webSocketService;

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String chatRoomId = (String) session.getAttributes().get("chatRoomId");
        webSocketService.addUserToChatRoom(chatRoomId, session);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String chatRoomId = (String) session.getAttributes().get("chatRoomId");
        ChatMessagesDto messageDto = new ChatMessagesDto();
        messageDto.setMessage(message.getPayload());
        // 메시지 타입, 유저 이름, 생성 시간 등을 필요에 따라 설정합니다.
        webSocketService.sendMessageToChatRoom(chatRoomId, messageDto);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String chatRoomId = (String) session.getAttributes().get("chatRoomId");
        webSocketService.removeUserFromChatRoom(chatRoomId, session);
    }
}
