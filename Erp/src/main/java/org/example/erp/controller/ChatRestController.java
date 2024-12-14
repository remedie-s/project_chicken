package org.example.erp.controller;

import org.example.erp.entity.ChatMessageEntity;
import org.example.erp.service.ChatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chats")
public class ChatRestController {

    private final ChatService chatService;

    public ChatRestController(ChatService chatService) {
        this.chatService = chatService;
    }

    // 1:1 채팅 내역 조회
    @GetMapping("/private/{user1}/{user2}")
    public List<ChatMessageEntity> getPrivateChatHistory(@PathVariable String user1, @PathVariable String user2) {
        return chatService.getPrivateChatHistory(user1, user2);  // 1:1 채팅 내역 조회
    }

    // 전체 채팅 내역 조회
    @GetMapping("/public")
    public List<ChatMessageEntity> getAllChatHistory() {
        return chatService.getAllChatHistory();  // 전체 채팅 내역 조회
    }

    // 메시지 저장 (전체 채팅 또는 1:1 채팅)
    @PostMapping
    public ChatMessageEntity saveMessage(@RequestBody ChatMessageEntity message) {
        // 메시지의 receiver 필드를 확인하여 전체 채팅인지 개인 채팅인지 구분
        if (message.getReceiver() == null || "all".equalsIgnoreCase(message.getReceiver())) {
            // 전체 채팅
            message.setReceiver("all"); // receiver를 "all"로 명시적으로 설정
        } else {
            // 1:1 채팅
            if (message.getSender() == null || message.getReceiver() == null) {
                throw new IllegalArgumentException("1:1 채팅의 경우 sender와 receiver가 반드시 필요합니다.");
            }
        }

        return chatService.saveMessage(message); // 메시지 저장
    }
}
