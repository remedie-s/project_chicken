package org.example.backend.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.OrdersDto;
import org.example.backend.entity.Carts;
import org.example.backend.entity.Orders;
import org.example.backend.entity.Products;
import org.example.backend.entity.Users;
import org.example.backend.repository.CartsRepository;
import org.example.backend.repository.OrdersRepository;
import org.example.backend.repository.ProductsRepository;
import org.example.backend.repository.UsersRepository;
import org.example.backend.utility.KafkaMessage;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {
    private final OrdersRepository ordersRepository;
    private final UsersRepository usersRepository;
    private final ProductsRepository productsRepository;
    private final CartsRepository cartsRepository;
    private final KafkaMessage kafkaMessage;

    // 주문 목록보기
    public List<OrdersDto> ordersList(Users user) {
        List<Orders> byUsersId = this.ordersRepository.findByUsers_Id((user.getId()));
        List<OrdersDto> ordersDtos = new ArrayList<>();
        for (Orders order : byUsersId) {
            if (order.isAvailable()) {
                OrdersDto ordersDto = order.toDto();
                ordersDtos.add(ordersDto);
            }
        }
        return ordersDtos;
    }

    // 숨긴 주문 목록보기
    public List<OrdersDto> ordersListHide(Users user) {
        List<Orders> byUsersId = this.ordersRepository.findByUsers_Id((user.getId()));
        List<OrdersDto> ordersDtos = new ArrayList<>();
        for (Orders order : byUsersId) {
            if (!order.isAvailable()) {
                OrdersDto ordersDto = order.toDto();
                ordersDtos.add(ordersDto);
            }
        }
        return ordersDtos;
    }


    //반품
    public boolean refundOrder(Long orderId) {
        Optional<Orders> byId = this.ordersRepository.findById(orderId);
        if (byId.isPresent()) {
            Orders order = byId.get();
            if (order.getStatus() == null) {
                log.error("주문 상태가 없습니다. 반품 신청 실패.");
                return false;
            }
            order.setStatus("반품 신청");
            this.ordersRepository.save(order);
            log.info("{}번 주문의 반품 신청이 접수되었습니다.", orderId);
            this.kafkaMessage.sendKafkaOrderMsg(order, "refund");
            return true;
        } else {
            log.error("{}번 주문이 존재하지 않습니다.", orderId);
            return false;
        }
    }

    // 주문 하나 특정
    public Orders findById(Long orderId) {
        Optional<Orders> byId = this.ordersRepository.findById(orderId);
        if (byId.isPresent()) {
            return byId.get();
        } else {
            return null;
        }
    }

    // 주문 추가
    //TODO 로그 바꿔야함

    public boolean orderAdd(Users users, OrdersDto[] ordersDtos) {
        // 주문 배열 열어서 처리
        for (OrdersDto ordersDto : ordersDtos) {
            Long productsId = ordersDto.getProductsDto().getId();
            Optional<Products> oProducts = this.productsRepository.findById(productsId);
            if (!oProducts.isPresent()) {
                return false;
            }
            Products products = oProducts.get();
            Orders order = new Orders();
            order.setQuantity(ordersDto.getQuantity());
            Long price = ordersDto.getPrice();
            Long payPrice = ordersDto.getPayPrice();
            order.setPrice(price);
            order.setPayPrice(payPrice);
            order.setDiscount(price - payPrice);
            order.setCreatedAt(LocalDateTime.now());
            // 숨김 처리 여부 기본 true
            order.setAvailable(true);
            order.setAddress(users.getAddress());
            order.setUsers(users);
            order.setProducts(products);
            order.setStatus("준비"); // 임시 처리
            this.ordersRepository.save(order);
            users.setTotalPurchaseCount(users.getTotalPurchaseCount() + 1);
            users.setTotalPurchasePrice(users.getTotalPurchasePrice() + payPrice);
            this.usersRepository.save(users);
            products.setStock(products.getStock() - order.getQuantity());
            products.setSellCount(products.getSellCount() + order.getQuantity());
            System.out.println("주문 저장중");
            log.info(products.getStock()+"");
            log.info("Checking stock for product ID {}: {}", products.getId(), products.getStock());
            if (products.getStock() <= 10) {
                log.info("Low stock alert for product ID {}. Remaining stock: {}", products.getId(), products.getStock());

            }
            this.kafkaMessage.sendKafkaProductMsg(products, "alert");
            this.productsRepository.save(products);


            this.kafkaMessage.sendKafkaOrderMsg(order, "order");

            log.info("Order created successfully for user ID {} with product ID {}", users.getId(), products.getId());
            Optional<Carts> oCarts = this.cartsRepository.findByUsersAndProducts(users, products);
            if (oCarts.isPresent()) {
                Carts carts = oCarts.get();
                this.cartsRepository.delete(carts);
            }

        }
        return true;
    }

    // 주문 숨기기 처리
    public boolean orderChangeAvailable(Users users, List<Long> orderIds) {
        for (Long orderId : orderIds) {
            Optional<Orders> oOrder = this.ordersRepository.findById(orderId);
            if (!oOrder.isPresent()) {
                return false;
            }
            Orders order = oOrder.get();
            order.setAvailable(!order.isAvailable());
        }
        return true;
    }

}
