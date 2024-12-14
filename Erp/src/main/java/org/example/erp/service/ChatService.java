package org.example.erp.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.entity.ChatMessageEntity;
import org.example.erp.repository.ChatMessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatService {
    private final ChatMessageRepository repository;

    public List<ChatMessageEntity> getChatHistory(String user1, String user2) {
        return repository.findBySenderOrReceiver(user1, user2); // 1:1 채팅 내역 조회
    }

    public ChatMessageEntity saveMessage(ChatMessageEntity message) {
        if(message.getReceiver() == null) {
            message.setReceiver("all");
        }
        return repository.save(message); // 메시지 저장
    }
    // 전체 채팅 내역 조회 (옵션)
    public List<ChatMessageEntity> getAllChatHistory() {
        return this.repository.findByReceiver("all");
    }

    // 1:1 채팅 내역 조회
    public List<ChatMessageEntity> getPrivateChatHistory(String user1, String user2) {
        return repository.findBySenderOrReceiverAndReceiverOrSender(user1, user2, user1, user2);
    }

}
