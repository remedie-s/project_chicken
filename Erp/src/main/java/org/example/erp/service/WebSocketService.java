package org.example.erp.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;
    private final Map<String, List<WebSocketSession>> chatRoomSessions = new HashMap<>(); // 채팅방 세션 관리

    @Autowired
    public WebSocketService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }


    // 유저를 채팅방에 추가
    public void addUserToChatRoom(String chatRoomId, WebSocketSession session) {
        chatRoomSessions.computeIfAbsent(chatRoomId, k -> new ArrayList<>()).add(session);
        log.info("User added to chat room {}: {}", chatRoomId, session.getId());
    }

    // 입장 메시지 전송
    public void sendJoinMessageToChatRoom(Long chatRoomId, ChatMessagesDto messageDto) {
        sendMessageToChatRoom(chatRoomId.toString(), messageDto);
    }

    // 유저를 채팅방에서 제거
    public void removeUserFromChatRoom(String chatRoomId, WebSocketSession session) {
        List<WebSocketSession> sessions = chatRoomSessions.get(chatRoomId);
        if (sessions != null) {
            sessions.remove(session);
            if (sessions.isEmpty()) {
                chatRoomSessions.remove(chatRoomId);
            }
        }
        log.info("User removed from chat room {}: {}", chatRoomId, session.getId());
    }

    // 퇴장 메시지 전송
    public void sendLeaveMessageToChatRoom(Long chatRoomId, ChatMessagesDto messageDto) {
        sendMessageToChatRoom(chatRoomId.toString(), messageDto);
    }

    // 채팅방 메시지 전송 (일반 메시지)
    public void sendMessageToChatRoom(String chatRoomId, ChatMessagesDto messageDto) {
        List<WebSocketSession> sessions = chatRoomSessions.get(chatRoomId);
        if (sessions != null) {
            for (WebSocketSession session : sessions) {
                try {
                    session.sendMessage(new TextMessage(messageDto.toString()));
                } catch (Exception e) {
                    log.error("Error sending message to chat room {}: {}", chatRoomId, e.getMessage());
                }
            }
        }
        log.info("Send message to room {}: {}", chatRoomId, messageDto.getMessage());
    }

}
