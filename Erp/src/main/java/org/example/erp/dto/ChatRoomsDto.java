package org.example.erp.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// 채팅방 정보 dto
public class ChatRoomsDto {
    private Long id;
    private String roomName;


}