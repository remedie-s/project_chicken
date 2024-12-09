package org.example.erp.service;


import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.ChatMessageRequest;
import org.example.erp.dto.ChatMessagesDto;
import org.example.erp.entity.ChatMessages;
import org.example.erp.entity.ChatRoomUserMap;
import org.example.erp.entity.ChatRooms;
import org.example.erp.entity.Employee;
import org.example.erp.repository.ChatMessagesRepository;
import org.example.erp.repository.ChatRoomUserMapRepository;
import org.example.erp.repository.ChatRoomsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ChatMessagesService {
    @Autowired
    private ChatMessagesRepository chatMessagesRepository;

    @Autowired
    private WebSocketService webSocketService; // 웹소켓을 통해 실시간 전송
    @Autowired
    private ChatRoomsRepository chatRoomsRepository;
    @Autowired
    private ChatRoomUserMapRepository chatRoomUserMapRepository;


    // 채팅방 확인
    public ChatRooms findChatRoomById(Long id) {
        return chatRoomsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

    }
    // 메시지 저장 후 실시간으로 전송
    public void sendMessageToChatRoom(ChatMessageRequest chatMessageRequest, Employee employee) {
        ChatRooms chatRoom = findChatRoomById(chatMessageRequest.getChatRoomId());

        // 메시지 객체 생성
        ChatMessages chatMessage = new ChatMessages();
        chatMessage.setChatRoom(chatRoom);
        chatMessage.setEmployee(employee);
        chatMessage.setMessage(chatMessageRequest.getMessage());
        chatMessage.setMessageType("text");
        chatMessage.setCreatedAt(LocalDateTime.now());

        // DB에 메시지 저장
        chatMessagesRepository.save(chatMessage);

        // 메시지 DTO 생성
        ChatMessagesDto chatMessageDto = new ChatMessagesDto(
                chatMessage.getChatRoom().getId(),
                chatMessage.getEmployee().getId(),
                chatMessage.getMessage(),
                chatMessage.getEmployee().getName(), // 이름을 사용
                chatMessage.getCreatedAt(),
                chatMessage.getMessageType()
        );

        // 웹소켓을 통해 실시간으로 메시지 전송
        webSocketService.sendMessageToChatRoom(chatRoom.getId().toString(), chatMessageDto);
    }

    // 입장 메시지 저장
    public void saveJoinMessage(ChatRooms chatRoom, Employee employee) {
        // 입장 메시지 생성
        ChatMessages joinMessage = new ChatMessages();
        joinMessage.setChatRoom(chatRoom);
        joinMessage.setEmployee(employee);
        joinMessage.setMessage(employee.getName() + "님이 입장하셨습니다."); // 이름을 사용
        joinMessage.setMessageType("enter");
        joinMessage.setCreatedAt(LocalDateTime.now());

        // DB에 메시지 저장
        chatMessagesRepository.save(joinMessage);

        // 메시지 DTO 생성
        ChatMessagesDto joinMessageDto = new ChatMessagesDto(
                joinMessage.getChatRoom().getId(),
                joinMessage.getEmployee().getId(),
                joinMessage.getMessage(),
                joinMessage.getEmployee().getName(), // 이름을 사용
                joinMessage.getCreatedAt(),
                joinMessage.getMessageType()
        );

        // 입장 메시지를 실시간으로 전송
        webSocketService.sendJoinMessageToChatRoom(chatRoom.getId(), joinMessageDto);
    }


    // 퇴장 메시지 저장
    public void saveLeaveMessage(ChatRooms chatRoom, Employee employee) {
        // 퇴장 메시지 생성
        ChatMessages leaveMessage = new ChatMessages();
        leaveMessage.setChatRoom(chatRoom);
        leaveMessage.setEmployee(employee);
        leaveMessage.setMessage(employee.getName() + "님이 퇴장하셨습니다."); // 이름을 사용
        leaveMessage.setMessageType("leave");
        leaveMessage.setCreatedAt(LocalDateTime.now());

        // DB에 메시지 저장
        chatMessagesRepository.save(leaveMessage);

        // 메시지 DTO 생성
        ChatMessagesDto leaveMessageDto = new ChatMessagesDto(
                leaveMessage.getChatRoom().getId(),
                leaveMessage.getEmployee().getId(),
                leaveMessage.getMessage(),
                leaveMessage.getEmployee().getName(), // 이름을 사용
                leaveMessage.getCreatedAt(),
                leaveMessage.getMessageType()
        );

        // 퇴장 메시지를 실시간으로 전송
        webSocketService.sendLeaveMessageToChatRoom(chatRoom.getId(), leaveMessageDto);
    }


    // 특정 채팅방의 메시지를 유저가 입장한 시간 이후로 가져오는 서비스 메서드
    public List<ChatMessagesDto> getMessagesByChatRoomAndUser(Long chatRoomId, Employee employee) {
        // 해당 채팅방을 찾기 (ID로)
        ChatRooms chatRoom = findChatRoomById(chatRoomId);

        // 유저가 해당 채팅방에 언제 입장했는지 찾기
        ChatRoomUserMap userChatRoomMap = chatRoomUserMapRepository.findByEmployeeAndChatRoom(employee, chatRoom)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저는 이 채팅방에 없습니다."));

        LocalDateTime joinTime = userChatRoomMap.getJoinTime();  // 유저의 입장 시간

        // 유저의 입장 이후에 발생한 메시지들만 조회
        List<ChatMessages> messages = chatMessagesRepository.findByChatRoomAndCreatedAtAfter(chatRoom, joinTime);

        return chatMessagListToDto(messages);
    }

    // 메세지 리스트 DTO 변환
    public List<ChatMessagesDto> chatMessagListToDto(List<ChatMessages> messages) {
        List<ChatMessagesDto> messagesDto = new ArrayList<>();
        for (ChatMessages message : messages) {
            ChatMessagesDto dto = new ChatMessagesDto();
            dto.setChatRoomId(message.getChatRoom().getId());
            dto.setEmployeeId(message.getEmployee().getId());
            dto.setMessage(message.getMessage());
            dto.setName(message.getEmployee().getName()); // 이름을 사용
            dto.setCreatedAt(message.getCreatedAt());
            dto.setMessageType(message.getMessageType());
            messagesDto.add(dto);
        }
        return messagesDto;
    }
}
