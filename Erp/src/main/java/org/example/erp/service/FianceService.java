package org.example.erp.service;

import jdk.jfr.Category;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.FianceDto;
import org.example.erp.dto.OrdersDto;
import org.example.erp.entity.Fiance;
import org.example.erp.entity.Orders;
import org.example.erp.repository.FianceRepository;
import org.example.erp.repository.OrdersRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@RequiredArgsConstructor
@Service
public class FianceService {
    private final FianceRepository fianceRepository;
    private final OrdersRepository ordersRepository;

    // 모든 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드
    public Map<String,Long> findAll() {
        List<Orders> all = this.ordersRepository.findAll();
        Map<String,Long> map = new HashMap<>();
        Long price=0L;
        Long discout=0L;
        Long payPrice=0L;
        Long cost=0L;

        for (Orders orders : all) {
            price+=orders.getPrice();
            discout+=orders.getDiscount();
            payPrice+=orders.getPayPrice();
            cost+=orders.getProducts().getCost();
        }
        map.put("price",price);
        map.put("discount",discout);
        map.put("payPrice",payPrice);
        map.put("cost",cost);
        return map;
    }

    // 기간 집어넣고 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드
    public Map<String,Long> findAllByDate(LocalDateTime startDate, LocalDateTime endDate) {
        List<Orders> byDate = this.ordersRepository.findAllByOrderDateBetween(startDate,endDate);
        Map<String,Long> map = new HashMap<>();
        Long price=0L;
        Long discout=0L;
        Long payPrice=0L;
        Long cost=0L;

        for (Orders orders : byDate) {
            price+=orders.getPrice();
            discout+=orders.getDiscount();
            payPrice+=orders.getPayPrice();
            cost+=orders.getProducts().getCost();
        }
        map.put("price",price);
        map.put("discount",discout);
        map.put("payPrice",payPrice);
        map.put("cost",cost);
        return map;
    }

    // 카테고리 집어넣고 주문 로드해서 총 판매액, 할인액, 결과액, 원가 추출 메소드
    public Map<String,Long> findAllByCate(String category) {
        List<Orders> byDate = this.ordersRepository.findAllByProducts_Category(category);
        Map<String,Long> map = new HashMap<>();
        Long price=0L;
        Long discout=0L;
        Long payPrice=0L;
        Long cost=0L;

        for (Orders orders : byDate) {
            price+=orders.getPrice();
            discout+=orders.getDiscount();
            payPrice+=orders.getPayPrice();
            cost+=orders.getProducts().getCost();
        }
        map.put("price",price);
        map.put("discount",discout);
        map.put("payPrice",payPrice);
        map.put("cost",cost);
        return map;
    }


    // 디비에 들어있는 현재 회사 내부 재산 추출하는 메소드(더미데이터 입력해놓은것)
    public List<FianceDto> all(){
        List<Fiance> all = this.fianceRepository.findAll();
        List<FianceDto> allDto = new ArrayList<>();
        for (Fiance fiance : all) {
            allDto.add(FianceDto.toDto(fiance));
        }
        return allDto;
    }

    // 내부재산 입력 메소드
    public boolean create(FianceDto fianceDto) {
        if(fianceDto!=null){
        Fiance entity = FianceDto.toEntity(fianceDto);
        this.fianceRepository.save(entity);
        log.info("{} 물품이 등록되었습니다.",entity);
        return true;
        }
        log.error("물품 등록이 실패하였습니다.");
        return false;

    }

    // 내부재산 변경 메소드
    public boolean update(FianceDto fianceDto) {
        if (fianceDto == null || fianceDto.getId() == null) {
            return false; // 유효한 ID가 없으면 수정 불가
        }

        // 기존 재산 정보 가져오기
        Fiance existingFiance = this.fianceRepository.findById(fianceDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Fiance not found with id: " + fianceDto.getId()));

        // 기존 엔티티 값 갱신
        existingFiance.setName(fianceDto.getName());
        existingFiance.setDescription(fianceDto.getDescription());
        existingFiance.setBuyPrice(fianceDto.getBuyPrice());
        existingFiance.setSellPrice(fianceDto.getSellPrice());
        existingFiance.setCurrentPrice(fianceDto.getCurrentPrice());
        existingFiance.setStatus(fianceDto.getStatus());
        existingFiance.setBuyTime(fianceDto.getBuyTime());
        existingFiance.setSellTime(fianceDto.getSellTime());

        // 갱신된 엔티티 저장
        this.fianceRepository.save(existingFiance);

        return true;

    }
    // 내부재산 제거 메소드
    public boolean delete(Long id) {
        this.fianceRepository.deleteById(id);
        return true;
    }



}
