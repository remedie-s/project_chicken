package org.example.erp.controller;

import com.google.firebase.messaging.FirebaseMessagingException;
import lombok.RequiredArgsConstructor;
import org.example.erp.entity.ChatMessageEntity;
import org.example.erp.entity.Employee;
import org.example.erp.service.ChatService;
import org.example.erp.service.EmployeeService;
import org.example.erp.service.FirebaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/chats")
public class ChatRestController {

    private final ChatService chatService;
    private final EmployeeService employeeService;
    private final FirebaseService firebaseService;


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
    public ChatMessageEntity saveMessage(@RequestBody ChatMessageEntity message) throws FirebaseMessagingException {
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
        if(!message.getReceiver().equals("all")) {
            Employee byEmail = this.employeeService.findByEmail(message.getReceiver());
            if (byEmail != null) {
                this.firebaseService.sendPushNotificationUser(
                        byEmail.getId(),
                        "새로운 메시지가 도착했습니다.",
                        message.getSender() + "님이 당신에게 메시지를 보냈습니다."
                );
            }
        }

        return chatService.saveMessage(message); // 메시지 저장
    }
}
