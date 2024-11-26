package org.example.erp.repository;

import org.example.erp.entity.Notice;
import org.example.erp.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, Long> {
}