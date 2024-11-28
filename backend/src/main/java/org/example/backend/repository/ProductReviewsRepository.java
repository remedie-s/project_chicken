package org.example.backend.repository;

import org.example.backend.entity.ProductReviews;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductReviewsRepository extends JpaRepository<ProductReviews, Long> {
    List<ProductReviews> findByProducts_id(Long id);
}
