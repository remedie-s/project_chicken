package org.example.erp.repository;

import org.example.erp.entity.ProductCustomers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCustomersRepository extends JpaRepository<ProductCustomers, Long> {
}
