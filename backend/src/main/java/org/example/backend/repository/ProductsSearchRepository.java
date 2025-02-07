package org.example.backend.repository;

import org.example.backend.search.ProductDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.annotations.Query;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface ProductsSearchRepository extends ElasticsearchRepository<ProductDocument, Long> {
    List<ProductDocument> findByNameContaining(String keyword);
    List<ProductDocument> findByCategory(String category);
    List<ProductDocument> findByPriceBetween(Double minPrice, Double maxPrice);
    
    // 상품명 기반 띄어쓰기 가능한 검색
@Query("{\"query_string\": {\"query\": \"*?0*\", \"fields\": [\"name\"], \"default_operator\": \"OR\"}}")
List<ProductDocument> findByProductNameUsingQueryString(String productName);

    // 카테고리와 키워드 검색
    List<ProductDocument> findByCategoryAndNameContaining(String category, String keyword);

    // 여러 카테고리를 기반으로 검색
    List<ProductDocument> findByCategoryIn(List<String> categories);

    // 가격 범위와 카테고리 결합 검색
    List<ProductDocument> findByCategoryAndPriceBetween(String category, Double minPrice, Double maxPrice);

    // 재고 기준 필터링
    List<ProductDocument> findByStockGreaterThanEqual(Long stock);
    List<ProductDocument> findByStockLessThan(Long stock);

    // 판매량 기준 정렬된 검색
    Page<ProductDocument> findAllByOrderBySellCountDesc(Pageable pageable);

    // @Query를 활용한 복잡한 동적 검색
    @Query("{\"bool\": {\"must\": [{\"match\": {\"name\": \"?0\"}}, {\"range\": {\"price\": {\"gte\": ?1, \"lte\": ?2}}}]}}")
    List<ProductDocument> findByNameAndPriceRange(String keyword, Double minPrice, Double maxPrice);

    // 페이징 및 정렬이 포함된 검색
    Page<ProductDocument> findByNameContaining(String keyword, Pageable pageable);

    // 추가 메서드
    List<ProductDocument> findByBrand(String brand);
    List<ProductDocument> findByBrandAndPriceBetween(String brand, Double minPrice, Double maxPrice);
    List<ProductDocument> findByBrandAndCategory(String brand, String category);
    Page<ProductDocument> findByBrandOrderBySellCountDesc(String brand, Pageable pageable);
    List<ProductDocument> findByBrandAndNameContaining(String brand, String keyword);
    @Query("""
       {
           "bool": {
               "must": [
                   {"term": {"brand": "?0"}},
                   {"term": {"category": "?1"}},
                   {"range": {"price": {"gte": ?2, "lte": ?3}}}
               ]
           }
       }
    """)
    List<ProductDocument> findByBrandCategoryAndPriceRange(String brand, String category, Double minPrice, Double maxPrice);
    List<ProductDocument> findByBrandIn(List<String> brands);
}