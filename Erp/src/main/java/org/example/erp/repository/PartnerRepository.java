package org.example.erp.repository;

import org.example.erp.entity.Orders;
import org.example.erp.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
}