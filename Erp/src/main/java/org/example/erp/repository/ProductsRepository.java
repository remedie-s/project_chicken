package org.example.erp.repository;

import org.example.erp.entity.ProductReviews;
import org.example.erp.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductsRepository extends JpaRepository<Products, Long> {
}
