package org.example.backend.repository;

import org.example.backend.entity.Carts;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartsRepository extends JpaRepository<Carts, Long> {
}
