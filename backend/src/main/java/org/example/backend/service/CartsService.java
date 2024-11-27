package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.CartsDto;
import org.example.backend.dto.OrdersDto;
import org.example.backend.entity.Carts;
import org.example.backend.entity.Orders;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;
import org.example.backend.repository.*;
import org.example.backend.utility.KafkaMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.example.backend.dto.CartsDto.cartsToDto;

@Service
@RequiredArgsConstructor
@Slf4j
public class CartsService {
    private final CartsRepository cartsRepository;
    private final OrdersRepository ordersRepository;
    private final UsersRepository usersRepository;
    private final DiscountPolicyRepository discountPolicyRepository;
    private final ProductsRepository productsRepository;
    private final KafkaMessage kafkaMessage;

    // 카트 리스트 보기 메소드
    public List<CartsDto> getCarts(Users users) {
        if(!this.cartsRepository.findByUsers(users).isEmpty()){
        List<Carts> byUser = this.cartsRepository.findByUsers(users);
        List<CartsDto> cartsDtos = new ArrayList<>();
        for (Carts carts : byUser) {
            cartsDtos.add(cartsToDto(carts));
            }
            return cartsDtos;
        }
        return new ArrayList<CartsDto>();

    }


    // 카트 물품 변경 메소드(0이하는 안됨), 0일시 삭제?
    public boolean modifyCarts(Users users, CartsDto cartsDto) {
        Optional<Carts> byId = this.cartsRepository.findById(cartsDto.getId());
        if(byId.isPresent()) {
            Carts carts = byId.get();
            carts.setQuantity(cartsDto.getQuantity());
            this.cartsRepository.save(carts);
            log.info("Modify carts by id: {}", cartsDto.getId());
            return true;
        }
        log.error("카트 변경 실패");
        return false;
    }
    
    // 카트 삭제 메소드
    public boolean deleteCarts(Users users, CartsDto cartsDto) {
        Optional<Carts> byId = this.cartsRepository.findById(cartsDto.getId());
        if(byId.isPresent()) {
            Carts carts = byId.get();
            cartsRepository.delete(carts);
            log.info("Delete carts by id: {}", cartsDto.getId());
            return true;
        }
        log.error("카트가 없어요");
        return false;

    }
    // 카트에서 주문 하기 메소드
    @Transactional
    public boolean cartToOrders(Users users, OrdersDto ordersDto) {
        Optional<Carts> optionalCart = cartsRepository.findById(ordersDto.getId()); // 1. 카트 ID를 기반으로 조회
        if (optionalCart.isPresent()) {
            Carts cart = optionalCart.get();
            Products product = cart.getProducts();

            // 2. 재고 확인
            if (product.getStock() < ordersDto.getQuantity()) {
                log.warn("Insufficient stock for product ID: {}", product.getId());
                return false;
            }

            // 3. 주문 생성 및 저장
            Orders orders = new Orders();
            orders.setUsers(users);
            orders.setProducts(product);
            orders.setQuantity(ordersDto.getQuantity());
            orders.setPrice(ordersDto.getPrice());
            orders.setDiscount(ordersDto.getDiscount()); // 할인 정책 추가 필요
            orders.setPayPrice(ordersDto.getPayPrice());
            orders.setAvailable(false);
            orders.setCreatedAt(LocalDateTime.now());
            orders.setAddress(ordersDto.getAddress()); // 주소 처리 추가 필요(배송지 선택 관련)
            ordersRepository.save(orders);

            // 4. 재고 업데이트
            product.setStock(product.getStock() - ordersDto.getQuantity());
            productsRepository.save(product);

            // 5. 카트에서 삭제
            cartsRepository.delete(cart);

            if (product.getStock() <= 10) {
                log.info("Low stock alert for product ID {}. Remaining stock: {}", product.getId(), product.getStock());
                this.kafkaMessage.sendKafkaProductMsg(product, "alert");
            }
            this.kafkaMessage.sendKafkaOrderMsg(orders, "order");

            log.info("Order created successfully for user ID {} with product ID {}", users.getId(), product.getId());
            return true;
        }

        log.warn("Cart not found for cart ID: {}", ordersDto.getId());
        return false;
    }

    


}
