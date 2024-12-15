package org.example.erp.repository;

import org.example.erp.entity.ChatMessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessageEntity, Long> {
    List<ChatMessageEntity> findBySenderOrReceiver(String sender, String receiver);
    List<ChatMessageEntity> findBySenderAndReceiverOrSenderAndReceiver(String sender1, String receiver1, String sender2, String receiver2);


    List<ChatMessageEntity> findByReceiver(String receiver);
}