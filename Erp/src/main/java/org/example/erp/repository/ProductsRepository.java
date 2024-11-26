package org.example.erp.repository;

import org.example.erp.entity.ProductReviews;
import org.example.erp.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductsRepository extends JpaRepository<Products, Long> {
    List<Products> findByCategory(String category);

    List<Products> findByEvent(Long event);
}
