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

import java.time.LocalDateTime;
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

    // 물품 카테고리별 리스트 로직


    // 물품 상세페이지 로직


    //TODO 물품 수량 낮음 경고(카프카)- 수신쪽으로 봐야할듯? 구매완료시 쇼핑몰 서버에서 카프카로 메시지 보내면 여기서 받아서 진행하는 로직 - 경고 서비스로 따로 뺄지 생각중





    // 물품 구매로직(직접구매) - 쇼핑몰 서버에서 구현 주문들어옴 경고(카프카)

    // 물품 구매로직(장바구니로 이동)  - 쇼핑몰 서버에서 구현 주문들어옴 경고(카프카)
    
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
                    .build();

            String message = objectMapper.writeValueAsString(productMessage);
            kafkaTemplate.send(TOPIC, message);
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
    }
}
