package org.example.erp.repository;

import org.example.erp.entity.InventoryAlert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryAlertRepository extends JpaRepository<InventoryAlert, Long> {
}