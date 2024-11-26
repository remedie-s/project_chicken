package org.example.erp.repository;

import org.example.erp.entity.Carts;
import org.example.erp.entity.DiscountPolicy;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiscountPolicyRepository extends JpaRepository<DiscountPolicy, Long> {
}
