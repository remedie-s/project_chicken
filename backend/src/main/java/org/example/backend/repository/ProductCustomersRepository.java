package org.example.backend.repository;

import org.example.backend.entity.ProductCustomers;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCustomersRepository extends JpaRepository<ProductCustomers, Long> {
}
