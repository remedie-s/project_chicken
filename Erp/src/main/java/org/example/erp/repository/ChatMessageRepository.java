package org.example.erp.repository;

import org.example.erp.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    List<ChatMessageEntity> findBySenderOrReceiver(String sender, String receiver);
    List<ChatMessageEntity> findBySenderOrReceiverAndReceiverOrSender(String user1, String user2, String user3, String user4);

    List<ChatMessageEntity> findByReceiver(String receiver);
}