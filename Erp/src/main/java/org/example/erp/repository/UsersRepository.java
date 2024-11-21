package org.example.erp.repository;

import org.example.erp.entity.Questions;
import org.example.erp.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
}
