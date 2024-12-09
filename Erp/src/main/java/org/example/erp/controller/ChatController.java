package org.example.erp.controller;

import org.example.erp.dto.ChatMessageRequest;
import org.example.erp.dto.ChatMessagesDto;
import org.example.erp.dto.ChatRoomInOutDto;
import org.example.erp.dto.ChatRoomsDto;
import org.example.erp.entity.Employee;
import org.example.erp.service.ChatMessagesService;
import org.example.erp.service.ChatRoomsService;
import org.example.erp.service.WebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    @Autowired
    private ChatRoomsService chatRoomsService;

    @Autowired
    private ChatMessagesService chatMessageService;
    @Autowired
    private WebSocketService webSocketService;

    // 채팅방 생성 API
    @PostMapping("/create")
    public ResponseEntity<ChatRoomsDto> createChatRoom(@RequestBody ChatRoomsDto chatRoomsDto,
                                                       @AuthenticationPrincipal Employee employee) {
        ChatRoomsDto chatRoom = chatRoomsService.createChatRoom(employee, chatRoomsDto.getRoomName());
        return ResponseEntity.ok(chatRoom);
    }

    @GetMapping("/room/list")
    public ResponseEntity<List<ChatRoomsDto>> getUserChatRooms(
            @AuthenticationPrincipal Employee employee) {
        List<ChatRoomsDto> chatRooms = chatRoomsService.findChatRoomsByUser(employee);
        return ResponseEntity.ok(chatRooms);
    }
    // 채팅방 메세지 조회
    @GetMapping("/room/{chatRoomId}/messages")
    public ResponseEntity<List<ChatMessagesDto>> getChatRoomMessages(@PathVariable Long chatRoomId,
                                                                     @AuthenticationPrincipal Employee employee) {
        List<ChatMessagesDto> messages = chatMessageService.getMessagesByChatRoomAndUser(chatRoomId, employee);
        return ResponseEntity.ok(messages);
    }

    // 메세지 보내기
    @PostMapping("/sendMessage")
    public ResponseEntity<Void> sendMessage(@RequestBody ChatMessageRequest chatMessageRequest,
                                            @AuthenticationPrincipal Employee employee) {
        chatMessageService.sendMessageToChatRoom(chatMessageRequest, employee);
        return ResponseEntity.ok().build();
    }

    // 채팅방에 유저 초대
    @PostMapping("/invite")
    public ResponseEntity<Void> inviteUserToChatRoom(@RequestBody ChatRoomInOutDto chatRoomInvite) {
        chatRoomsService.inviteUserToChatRoom(chatRoomInvite);
        return ResponseEntity.ok().build();
    }

    // 채팅방에 유저 입장
    @PostMapping("/join")
    public ResponseEntity<Void> joinChatRoom(@RequestBody ChatRoomInOutDto chatRoomIn,
                                             @AuthenticationPrincipal Employee employee) {
        chatRoomsService.joinChatRoom(chatRoomIn.getChatRoomId(), employee);
        return ResponseEntity.ok().build();
    }

    // 채팅방에서 유저 퇴장
    @PostMapping("/leave")
    public ResponseEntity<Void> leaveChatRoom(@RequestBody ChatRoomInOutDto chatRoomOut,
                                              @AuthenticationPrincipal Employee employee) {
        chatRoomsService.leaveChatRoom(chatRoomOut.getChatRoomId(), employee);
        return ResponseEntity.ok().build();
    }

}

