package org.example.erp.repository;

import org.example.erp.entity.Orders;
import org.example.erp.entity.Partner;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PartnerRepository extends JpaRepository<Partner, Long> {
    Optional<Partner> findById(Long Id);
}