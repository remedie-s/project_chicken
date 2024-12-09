package org.example.erp.repository;

import org.example.erp.entity.ChatRooms;
import org.example.erp.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatRoomsRepository extends JpaRepository<ChatRooms, Long> {
}
