package org.example.erp.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ChatRooms {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String roomName;

    // 채팅방에 참여하는 사용자 목록
    @OneToMany(mappedBy = "chatRoom")
    private List<ChatRoomUserMap> chatRoomUserMaps;

    // 메시지 목록
    @OneToMany(mappedBy = "chatRoom")
    private List<ChatMessages> chatMessages;

}
