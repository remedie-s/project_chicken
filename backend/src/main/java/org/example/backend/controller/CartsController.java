package org.example.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.backend.dto.CartsDto;
import org.example.backend.dto.OrdersDto;
import org.example.backend.entity.Users;
import org.example.backend.service.CartsService;
import org.springframework.data.domain.jaxb.SpringDataJaxb;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/carts")
public class CartsController {

    private final CartsService cartsService;

    // 카트 리스트 보기
    @GetMapping("/list")
    public ResponseEntity<?> cartList(@AuthenticationPrincipal Users users){
        log.info("{}의 카트 리스트 요청입니다",users);
        List<CartsDto> carts = this.cartsService.getCarts(users);
        return ResponseEntity.ok(carts);
    }

    // 카트 물품 변경 메소드 0이하 안됨
    @PostMapping("/modify/{cartId}")
    public ResponseEntity<?> modifyCart(@AuthenticationPrincipal Users users,
                                        @PathVariable Long cartId,@Valid @RequestBody CartsDto cartsDto){
        if(this.cartsService.modifyCarts(users, cartsDto)){
            return ResponseEntity.ok(cartsDto);
        }else {
            return ResponseEntity.status(500).body("카트 변경 오류입니다.");
        }
    }
    
    // 카트 삭제 메소드
    @PostMapping("/delete/{cartId}")
    public ResponseEntity<?> deleteCart(@PathVariable Long cartId, @AuthenticationPrincipal Users users){
        if(this.cartsService.deleteCarts(cartId)){
            List<CartsDto> carts = this.cartsService.getCarts(users);
            return ResponseEntity.ok(carts);
        }
        return ResponseEntity.status(500).body("카트 삭제 오류입니다.");
    }

    // 카트에서 주문하기 메소드
    @PostMapping("/order")
    public ResponseEntity<?> orderCart(@AuthenticationPrincipal Users users,
                                       @Valid @RequestBody OrdersDto ordersDto){
        if(this.cartsService.cartToOrders(users, ordersDto)){
            List<CartsDto> carts = this.cartsService.getCarts(users);
            return ResponseEntity.ok(carts);
        }
        return ResponseEntity.status(500).body("주문 등록 오류입니다.");
    }




}
