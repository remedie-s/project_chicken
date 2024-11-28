package org.example.erp.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.KafkaProductMessage;
import org.example.erp.dto.ProductsDto;
import org.example.erp.entity.Products;
import org.example.erp.repository.*;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import javax.swing.text.html.parser.Entity;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class ProductsService {
    private final ProductsRepository productsRepository;
    private final DiscountPolicyRepository discountPolicyRepository;
    private final EventRepository eventRepository;
    private final InventoryAlertRepository inventoryAlertRepository;
    private final ProductReviewsRepository productReviewsRepository;

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final String TOPIC = "product-changes"; // 카프카 주제



    //물품 등록 로직(엘라스틱서치 색인도 동시에 진행)
    public void registerProduct(ProductsDto productsDto) {
        
        Products products = new Products();
        dtoToEntity(productsDto, products);

        // ERP 시스템에서 물품 등록
        productsRepository.save(products);

        // Kafka 메시지 발행 - JSON 형식
        sendKafkaMsg(products,"register");
    }

    // 물품 변경로직(수량)
    public void updateProduct(ProductsDto productsDto) {
        Optional<Products> byId = this.productsRepository.findById(productsDto.getId());
        if (byId.isPresent()) {
            Products products = byId.get();
            dtoToEntity(productsDto, products);

            // ERP 시스템에서 물품 수정
            productsRepository.save(products);

            // Kafka 메시지 발행 - JSON 형식
            sendKafkaMsg(products,"update");

        } else {
            log.error("{} 물품이 없어요", productsDto.getName());
        }
    }

    // 물품 삭제로직
    public void deleteProduct(ProductsDto productsDto) {
        Optional<Products> byId = this.productsRepository.findById(productsDto.getId());
        if (byId.isPresent()) {
            Products products = byId.get();
            dtoToEntity(productsDto, products);

            // ERP 시스템에서 물품 삭제
            productsRepository.deleteById(productsDto.getId());

            // Kafka 메시지 발행 - JSON 형식
            sendKafkaMsg(products,"delete");
        } else {
            log.error("{} 물품이 없어요", productsDto.getName());
        }
    }
    // 물품 리스트 로직
    public List<ProductsDto> findAll() {
        List<Products> all = this.productsRepository.findAll(); // 모든 제품을 조회
        List<ProductsDto> list = new ArrayList<>();
        for (Products products : all) {
            ProductsDto productsDto = new ProductsDto(); // 새로운 ProductsDto 객체 생성
            EntityToDto(products, productsDto); // 엔티티를 DTO로 변환
            list.add(productsDto); // 변환된 DTO를 리스트에 추가
        }
        return list; // DTO 리스트 반환
    }

    // 물품 카테고리별 리스트 로직
    public List<ProductsDto> findByCategory(String category) {
        List<Products> byCategory = this.productsRepository.findByCategory(category); // 모든 제품을 조회
        List<ProductsDto> list = new ArrayList<>();
        for (Products products : byCategory) {
            ProductsDto productsDto = new ProductsDto(); // 새로운 ProductsDto 객체 생성
            EntityToDto(products, productsDto); // 엔티티를 DTO로 변환
            list.add(productsDto); // 변환된 DTO를 리스트에 추가
        }
        return list; // DTO 리스트 반환
    }
    // 물품 이벤트 별 리스트 로직
    public List<ProductsDto> findByEvent(Long event) {
        List<Products> byEvent = this.productsRepository.findByEvent(event); // 모든 제품을 조회
        List<ProductsDto> list = new ArrayList<>();
        for (Products products : byEvent) {
            ProductsDto productsDto = new ProductsDto(); // 새로운 ProductsDto 객체 생성
            EntityToDto(products, productsDto); // 엔티티를 DTO로 변환
            list.add(productsDto); // 변환된 DTO를 리스트에 추가
        }
        return list;

    }
    // 물품 상세페이지 로직
    public ProductsDto findById(Long id) {
        Optional<Products> byId = this.productsRepository.findById(id);
        if (byId.isPresent()) {
            Products products = byId.get();
            ProductsDto productsDto = new ProductsDto();
            EntityToDto(products, productsDto);
            return productsDto;
        }
        return null;
    }



    //TODO 물품 수량 낮음 경고(카프카)- 수신


    //TODO 물품 구매로직 - 쇼핑몰 서버에서 구현 주문들어옴 경고(카프카)- 수신

    
    //TODO 물품 리뷰 관리 로직 (삭제 ? 아니면 여기에 답글 달기 기능 추가 여부?) 물품 리뷰가 들어오면 경고 이벤트?

    // 카프카 메시지 전송 로직
    private void sendKafkaMsg(Products products,String action) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            KafkaProductMessage productMessage = KafkaProductMessage.builder()
                    .action(action)
                    .id(products.getId())
                    .name(products.getName())
                    .description(products.getDescription())
                    .price(products.getPrice())
                    .category(products.getCategory())
                    .imageUrl(products.getImageUrl())
                    .stock(products.getStock())
                    .brand(products.getBrand())
                    .cost(products.getCost())
                    .build();

            String message = objectMapper.writeValueAsString(productMessage);
            kafkaTemplate.send(TOPIC, message);
            log.info("{}에 관한 메시지를 보냅니다",TOPIC);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize Kafka message", e);
        }
    }

    // 전달 받은 DTO를 엔티티로 변경하는 메소드
    private void dtoToEntity(ProductsDto productsDto, Products products) {
        products.setName(productsDto.getName());
        products.setDescription(productsDto.getDescription());
        products.setPrice(productsDto.getPrice());
        products.setCreatedAt(LocalDateTime.now());
        products.setImageUrl(productsDto.getImageUrl());
        products.setStock(productsDto.getStock());
        products.setSellCount(0L);
        products.setCategory(productsDto.getCategory());
        products.setMainItemNumber(productsDto.getMainItemNumber());
        products.setEvent(productsDto.getEvent());
        products.setBrand(productsDto.getBrand());
        products.setCost(productsDto.getCost());
    }
    // 전달 받은 엔티티를 DTO로 변환하는 메소드
    private void EntityToDto(Products products, ProductsDto productsDto) {
        productsDto.setId(products.getId());
        productsDto.setName(products.getName());
        productsDto.setDescription(products.getDescription());
        productsDto.setPrice(products.getPrice());
        productsDto.setCreatedAt(products.getCreatedAt());
        productsDto.setImageUrl(products.getImageUrl());
        productsDto.setStock(products.getStock());
        productsDto.setSellCount(products.getSellCount());
        productsDto.setCategory(products.getCategory());
        productsDto.setMainItemNumber(products.getMainItemNumber());
        productsDto.setEvent(products.getEvent());
        productsDto.setBrand(products.getBrand());
        productsDto.setCost(products.getCost());
    }
}
