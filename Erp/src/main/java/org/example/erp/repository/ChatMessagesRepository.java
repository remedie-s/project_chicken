package org.example.erp.repository;

import org.example.erp.entity.ChatMessages;
import org.example.erp.entity.ChatRooms;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ChatMessagesRepository extends JpaRepository<ChatMessages, Long> {

    // 특정 채팅방에서 특정 시간 이후에 발생한 메시지를 가져오는 쿼리 메서드
    List<ChatMessages> findByChatRoomAndCreatedAtAfter(ChatRooms chatRoom, LocalDateTime joinTime);
}
