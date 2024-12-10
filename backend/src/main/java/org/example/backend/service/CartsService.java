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
    public boolean modifyCarts(Users users, Long cartsId, Long quantity) {
        Optional<Carts> byId = this.cartsRepository.findById(cartsId);
        if(byId.isPresent()) {
            Carts carts = byId.get();
            carts.setQuantity(quantity);
            this.cartsRepository.save(carts);
            log.info("Modify carts by id: {}", cartsId);
            return true;
        }
        log.error("카트 변경 실패");
        return false;
    }
    
    // 카트 삭제 메소드
    public boolean deleteCarts(List<Long> cartIds) {
        try {
            for (Long cartId : cartIds) {
                deleteCartOne(cartId);
            }
            return true;
        } catch (Exception e) {
            // 로그 추가 등 예외 처리
            return false;
        }
    }
    // 카트에서 주문 하기 메소드(엘라스틱 서치 색인도 변경 필요)
    // TODO (엘라스틱 서치 색인도 변경 필요)
    @Transactional
    public boolean cartToOrders(Users users, OrdersDto ordersDto) {
        log.info("카트에서 주문 요청이 들어왔어요.");
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
            orders.setStatus("주문 접수");
            orders.setAddress(ordersDto.getAddress()); // 주소 처리 추가 필요(배송지 선택 관련)
            ordersRepository.save(orders);

            // 4. 재고 업데이트
            product.setStock(product.getStock() - ordersDto.getQuantity());
            productsRepository.save(product);

            // 5. 카트에서 삭제
            cartsRepository.delete(cart);

//            if (product.getStock() <= 10) {
//                log.info("Low stock alert for product ID {}. Remaining stock: {}", product.getId(), product.getStock());
//                this.kafkaMessage.sendKafkaProductMsg(product, "alert");
//            }
//            this.kafkaMessage.sendKafkaOrderMsg(orders, "order");

            log.info("Order created successfully for user ID {} with product ID {}", users.getId(), product.getId());
            return true;
        }

        log.warn("Cart not found for cart ID: {}", ordersDto.getId());
        return false;
    }

    // 카트 추가
    public boolean addCarts(Users users, CartsDto cartsDto) {
        Products product = getOnePoruct(cartsDto.getProductId());
        if (product==null) return false;
        Optional<Carts> oCarts = this.cartsRepository.findByUsersAndProducts(users, product);
        if(oCarts.isPresent()) {
            Carts carts = oCarts.get();
            carts.setQuantity(carts.getQuantity() + cartsDto.getQuantity());
        this.cartsRepository.save(carts);
        log.info("Add carts by id: {}", cartsDto.getId());
        return true;
        }
        Carts carts = new Carts();
        carts.setProducts(product);
        carts.setUsers(users);
        carts.setQuantity(cartsDto.getQuantity());
        this.cartsRepository.save(carts);
        log.info("Add carts by id: {}", cartsDto.getId());
        return true;
    }
    // 물건 하나 정보 획득
    public Products getOnePoruct(Long productId) {
        Optional<Products> oProducts = this.productsRepository.findById(productId);
        if (oProducts.isPresent()) {
            return oProducts.get();
        } else return null;
    }
    // 카트 하나 삭제 메소드
    public boolean deleteCartOne(Long cartId) {
        Optional<Carts> oCart = this.cartsRepository.findById(cartId);
        if(oCart.isPresent()) {
            Carts cart = oCart.get();
            cartsRepository.delete(cart);
            log.info("Delete carts by id: {}", cartId);
            return true;
        }
        log.error("존재하지 않는 카트");
        return false;
    }
    


}
