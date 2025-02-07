package org.example.backend.search;

import lombok.Data;
import org.example.backend.entity.Products;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Data
@Document(indexName = "products")
public class ProductDocument {
    @Id
    private Long id;

    @Field(type = FieldType.Text, analyzer = "standard")
    private String name;

    @Field(type = FieldType.Text, analyzer = "standard")
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
    private Long sellCount;

    @Field(type = FieldType.Text)
    private String brand;

//    @Field(type = FieldType.Date)
//    private String createdAt; // 상품 생성일 추가

    @Field(type = FieldType.Date)
    private LocalDate createdAt; // LocalDateTime으로 유지


    @Field(type = FieldType.Integer)
    private Integer event; // 이벤트 번호 추가

    @Field(type = FieldType.Long)
    private Long cost; // 원가 추가

    public static ProductDocument fromEntity(Products product) {
        ProductDocument document = new ProductDocument();
        document.setId(product.getId());
        document.setName(product.getName());
        document.setDescription(product.getDescription());
        document.setPrice(product.getPrice().doubleValue());
        document.setCategory(product.getCategory());
        document.setStock(product.getStock());
        document.setImageUrl(product.getImageUrl());
        document.setSellCount(product.getSellCount());
        document.setBrand(product.getBrand());
        document.setCreatedAt(product.getCreatedAt().toLocalDate()); // LocalDate로 변환

        document.setEvent(product.getEvent()); // event 값 추가
        document.setCost(product.getCost()); // cost 값 추가
        return document;
    }
}
