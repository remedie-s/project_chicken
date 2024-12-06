package org.example.backend.repository;

import org.example.backend.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ProductsRepository extends JpaRepository<Products, Long> {
    // 일주일 자료 갖고 오는 JPA 쿼리문
    List<Products> findByCreatedAtAfter(LocalDateTime oneWeekAgo);
    // 특정 이벤트 값이 아닌 건 걸러냄
    List<Products> findByEventNot(int event);
    List<Products> findAllByOrderByIdDesc();
    List<Products> findByEventNotOrderByIdDesc(int event);
    List<Products> findByCreatedAtAfterOrderByIdDesc(LocalDateTime oneWeekAgo);
}
