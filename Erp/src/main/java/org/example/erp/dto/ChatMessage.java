package org.example.erp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatMessage {
    private String sender;
    private String receiver;
    private String content;
    private MessageType type;
    private String senderId;
    private String receiverId;

    public enum MessageType {
        CHAT,
        JOIN,
        LEAVE
    }
}