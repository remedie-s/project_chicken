package org.example.erp.service;

import org.example.erp.dto.ChatMessagesDto;
import org.example.erp.dto.ChatRoomInOutDto;
import org.example.erp.dto.ChatRoomsDto;
import org.example.erp.entity.ChatRoomUserMap;
import org.example.erp.entity.ChatRooms;
import org.example.erp.entity.Employee;
import org.example.erp.repository.ChatRoomUserMapRepository;
import org.example.erp.repository.ChatRoomsRepository;
import org.example.erp.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatRoomsService {
    @Autowired
    private ChatRoomsRepository chatRoomRepository;

    @Autowired
    private ChatRoomUserMapRepository chatRoomUserMapRepository;
    @Autowired
    private ChatRoomsRepository chatRoomsRepository;
    @Autowired
    private WebSocketService webSocketService;
    @Autowired
    private ChatMessagesService chatMessagesService;
    @Autowired
    private EmployeeRepository employeeRepository;


    // 채팅방 DTO 반환
    public ChatRoomsDto getChatRoomById(Long chatRoomId) {
        ChatRooms chatRoom = chatRoomsRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));
        return new ChatRoomsDto(chatRoom.getId(), chatRoom.getRoomName());
    }

    public ChatRoomsDto createChatRoom(Employee employee, String chatRoomName) {
        ChatRooms chatRoom = new ChatRooms();
        chatRoom.setRoomName(chatRoomName);
        chatRoomsRepository.save(chatRoom); // chatRoomsRepository만 사용

        ChatRoomUserMap chatRoomUserMap = new ChatRoomUserMap();
        chatRoomUserMap.setEmployee(employee);
        chatRoomUserMap.setChatRoom(chatRoom);
        chatRoomUserMap.setJoinTime(LocalDateTime.now());
        chatRoomUserMapRepository.save(chatRoomUserMap);

        return new ChatRoomsDto(chatRoom.getId(), chatRoom.getRoomName());
    }

    private ChatRoomsDto convertToDto(ChatRoomUserMap chatRoomUserMap) {
        ChatRooms chatRoom = chatRoomUserMap.getChatRoom();
        return new ChatRoomsDto(chatRoom.getId(), chatRoom.getRoomName());
    }

    public List<ChatRoomsDto> findChatRoomsByUser(Employee employee) {
        List<ChatRoomUserMap> userChatRooms = chatRoomUserMapRepository.findByEmployee(employee);

        List<ChatRoomsDto> chatRoomsDtos = new ArrayList<>();
        for (ChatRoomUserMap map : userChatRooms) {
            chatRoomsDtos.add(convertToDto(map));
        }
        return chatRoomsDtos;
    }

    // 채팅방에 유저 입장 처리
    public void joinChatRoom(Long chatRoomId, Employee employee) {
        // 채팅방 존재 여부 체크
        ChatRooms chatRoom = chatRoomsRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        // 유저와 채팅방 관계 생성
        ChatRoomUserMap userChatRoom = new ChatRoomUserMap();
        userChatRoom.setChatRoom(chatRoom);
        userChatRoom.setEmployee(employee);
        userChatRoom.setJoinTime(LocalDateTime.now());
        userChatRoom.setActive(true);

        // 유저와 채팅방 관계 DB에 저장
        chatRoomUserMapRepository.save(userChatRoom);

        // 입장 메시지를 생성 및 저장
        chatMessagesService.saveJoinMessage(chatRoom, employee);
    }


    // 채팅방에서 유저 퇴장 처리
    public void leaveChatRoom(Long chatRoomId, Employee employee) {
        // 유저가 해당 채팅방에 존재하는지 확인
        ChatRoomUserMap userChatRoom = chatRoomUserMapRepository.findByEmployeeIdAndChatRoomId(employee.getId(), chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("유저가 이 채팅방에 없습니다."));

        // 유저를 채팅방에서 제외 (활성화 상태 변경)
        userChatRoom.setActive(false);
        chatRoomUserMapRepository.save(userChatRoom);

        // 퇴장 메시지를 생성 및 저장
        chatMessagesService.saveLeaveMessage(userChatRoom.getChatRoom(), employee);
    }

    // 유저 초대 처리
    public void inviteUserToChatRoom(ChatRoomInOutDto chatRoomInvite) {
        Long chatRoomId = chatRoomInvite.getChatRoomId();
        Long employeeId = chatRoomInvite.getEmployeeId();

        // 채팅방 존재 여부 체크
        ChatRooms chatRoom = chatRoomsRepository.findById(chatRoomId)
                .orElseThrow(() -> new IllegalArgumentException("채팅방을 찾을 수 없습니다."));

        // 유저 존재 여부 체크
        Employee employee = findEmployeeById(employeeId);

        // 이미 채팅방에 있는지 체크
        boolean alreadyInRoom = chatRoomUserMapRepository.existsByEmployeeAndChatRoom(employee, chatRoom);
        if (!alreadyInRoom) {
            ChatRoomUserMap userChatRoom = new ChatRoomUserMap();
            userChatRoom.setChatRoom(chatRoom);
            userChatRoom.setEmployee(employee);
            userChatRoom.setJoinTime(LocalDateTime.now());
            userChatRoom.setActive(true);
            chatRoomUserMapRepository.save(userChatRoom);

            // 초대 메시지를 생성 및 저장
            chatMessagesService.saveJoinMessage(chatRoom, employee);
        }
    }


    // 유저 조회 메서드
    private Employee findEmployeeById(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new IllegalArgumentException("유저를 찾을 수 없습니다."));
    }

}
