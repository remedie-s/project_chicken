package org.example.backend.repository;

import org.example.backend.entity.Carts;
import org.example.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartsRepository extends JpaRepository<Carts, Long> {
    List<Carts> findByUsers(Users users);
}
