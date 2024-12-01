package org.example.erp.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.erp.dto.OrdersDto;
import org.example.erp.entity.Orders;
import org.example.erp.service.OrdersService;
import org.example.erp.service.UsersService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/order")
public class OrdersController {
    private final OrdersService ordersService;
    private final UsersService usersService;

    // 주문 관리 메소드

    // 주문 전체리스트 보기 메소드
    @GetMapping("/all")
    public ResponseEntity<?> getOrders() {
        return ResponseEntity.ok(ordersService.findAll());
    }


    // 주문 리스트(고객아이디) 보기 메소드
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserOrders(@PathVariable ("userId") Long userId) {
        return ResponseEntity.ok(ordersService.findByUserId(userId));
    }

    // 주문 리스트(물품) 보기 메소드
    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getProductOrders(@PathVariable ("productId") Long productId) {
        return ResponseEntity.ok(this.ordersService.findByProductId(productId));
    }
    // 주문 상태 변경 메소드
    @PostMapping("/{orderId}")
    public ResponseEntity<?> detailOrders(@PathVariable ("orderId") Long orderId) {
        Orders byId = this.ordersService.findById(orderId);
        if (byId == null) {
            return ResponseEntity.badRequest().body("Order not found");
        }
        return ResponseEntity.ok(byId);

    }

    // 주문 상태 변경 메소드
    @PutMapping("/{orderId}")
    public ResponseEntity<?> modifyOrders(@RequestBody @Valid OrdersDto ordersDto,@PathVariable ("orderId") Long orderId) {
        Orders byId = this.ordersService.findById(orderId);
        if (byId == null) {
            return ResponseEntity.badRequest().body("Order not found");
        }
        byId.setInvoice(ordersDto.getInvoice());
        byId.setStatus(ordersDto.getStatus());
        boolean isModified = this.ordersService.modify(orderId, byId);
        if (!isModified) {
            return ResponseEntity.status(500).body("Failed to modify order");
        }
        return ResponseEntity.ok("주문을 변경하였습니다");

    }

    // 주문 삭제 메소드
    @DeleteMapping("/{orderId}")
    public ResponseEntity<?> deleteOrders(@PathVariable ("orderId") Long orderId) {
        boolean isReturned = ordersService.delete(orderId);
        if (isReturned) {
            return ResponseEntity.ok("Order returned successfully");
        }
        return ResponseEntity.badRequest().body("Failed to process return");

    }

    // 반품 관련 로직을 만들것인가?- 상태로직으로 변경

}
