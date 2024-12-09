package org.example.erp.repository;

import org.example.erp.entity.ChatRoomUserMap;
import org.example.erp.entity.ChatRooms;
import org.example.erp.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomUserMapRepository extends JpaRepository<ChatRoomUserMap, Long> {
    Optional<ChatRoomUserMap> findByEmployeeIdAndChatRoomId(Long employeeId, Long chatRoomId);
    Optional<ChatRoomUserMap> findByEmployeeAndChatRoom(Employee employee, ChatRooms chatRoom);
    List<ChatRoomUserMap> findByEmployee(Employee employee);
    boolean existsByEmployeeAndChatRoom(Employee employee, ChatRooms chatRoom);
}
