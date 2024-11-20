package org.example.backend.repository;

import org.example.backend.entity.DiscountPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountPolicyRepository extends JpaRepository<DiscountPolicy,Long> {
}
