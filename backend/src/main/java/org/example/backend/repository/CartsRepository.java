package org.example.backend.repository;

import org.example.backend.entity.Carts;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartsRepository extends JpaRepository<Carts, Long> {
    List<Carts> findByUsers(Users users);
    Optional<Carts> findByUsersAndProducts(Users users, Products products);
}
