package org.example.backend.repository;

import org.example.backend.entity.Orders;
import org.example.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String username);

    Optional<Users> findByName(String name);
}
