package org.example.erp.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// 채팅방 들어오고 나갈 때 dto
public class ChatRoomInOutDto {
    private Long chatRoomId;
    private Long employeeId;
}
