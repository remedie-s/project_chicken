package org.example.backend.search;

import lombok.Data;
import org.example.backend.entity.Products;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

/**
 * 엘라스틱 서치용 엔티티
 */
@Data
@Document(indexName = "products")
public class ProductDocument {
    @Id
    private Long id;
    @Field(type = FieldType.Text)
    private String name;
    @Field(type = FieldType.Text)
    private String description;
    @Field(type = FieldType.Double)
    private Double price;
    @Field(type = FieldType.Keyword)
    private String category;
    @Field(type = FieldType.Long)
    private Long stock;
    @Field(type = FieldType.Keyword)
    private String imageUrl;
    @Field(type = FieldType.Long)
    private Long sellCount; // sellCount 필드 추가

    public static ProductDocument fromEntity(Products product) {
        ProductDocument document = new ProductDocument();
        document.setId(product.getId());
        document.setName(product.getName());
        document.setDescription(product.getDescription());
        document.setPrice(product.getPrice().doubleValue());
        document.setCategory(product.getCategory());
        document.setStock(product.getStock());
        document.setImageUrl(product.getImageUrl());
        return document;
    }
}
