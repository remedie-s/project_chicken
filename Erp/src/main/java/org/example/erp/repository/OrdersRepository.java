package org.example.erp.repository;

import org.example.erp.entity.Notice;
import org.example.erp.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
    @Query("SELECT o FROM Orders o WHERE o.createdAt BETWEEN :startDate AND :endDate")
    List<Orders> findAllByOrderDateBetween(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    List<Orders> findAllByProducts_Category(String category);
}