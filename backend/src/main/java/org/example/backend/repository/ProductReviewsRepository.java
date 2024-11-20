package org.example.backend.repository;

import org.example.backend.entity.ProductReviews;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductReviewsRepository extends JpaRepository<ProductReviews, Long> {
}
