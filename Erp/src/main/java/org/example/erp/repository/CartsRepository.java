package org.example.erp.repository;

import org.example.erp.entity.Answers;
import org.example.erp.entity.Carts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartsRepository extends JpaRepository<Carts, Long> {
}
