package org.example.backend.repository;

import org.example.backend.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    // 특정 사용자 ID에 대한 주문 목록 가져오기
    List<Orders> findByUsers_Id(Long usersId);
    // 특정 월에 해당하는 사용자의 주문 내역을 구할 수 있는 메서드
    List<Orders> findByUsersIdAndCreatedAtBetween(Long usersId, LocalDateTime startDate, LocalDateTime endDate);
    Orders findFirstByUsers_Id(Long usersId);
    Orders findFirstByUsers_IdAndProducts_Id(Long usersId, Long productsId);
}
