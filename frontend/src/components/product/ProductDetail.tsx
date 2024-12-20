"use client"

import {
    Box,
    Button,
    Paper, Rating,
    TextField,
    Toolbar,
    Typography,
    useScrollTrigger
} from "@mui/material";
import React, {ChangeEvent, ReactNode, useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import Warranty from "@/components/product/Warranty";
import authApi from "@/scripts/auth/authApi";
import type {ProductsDto} from "@/types/productType";
import {ProductReviewsDto} from "@/types/productReviewType";
import gradeDiscountPrice from "@/scripts/GradeDiscountPrice";
import {OrderRequestType} from "@/types/orderType";
import ReviewList from "@/components/review/ReviewList";
import {getCookie} from "@/scripts/cookieScript";
import ScrollBox from "@/components/product/ScrollBox";
import StarIcon from "@mui/icons-material/Star";
const cookie = require("cookie");

export default function ProductDetail({productId}: { productId: string }) {
    const appbarTrigger = useScrollTrigger();
    const router = useRouter();
    const [productDetail, setProductDetail] = useState<ProductsDto | null>(null);
    const [productReviews, setProductReviews] = useState<ProductReviewsDto[]|null>();
    const [quantity, setQuantity] = useState(0);
    const [reviewCreateAuth, setReviewCreateAuth] = useState(false);
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const accessToken = getCookie("accessToken");
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // 기본값 설정
                let res: { status: number, data: ProductsDto };
                if (!accessToken){
                    res = await axios.get<ProductsDto>(`${apiUrl}/products/detail/${productId}`);
                } else {
                    res = await authApi.get<ProductsDto>(`${apiUrl}/products/detail/${productId}/user`);
                    setReviewCreateAuth(res.data.boughtUser);
                }
                if (res.status !== 200) {
                    alert("상품 정보를 불러오는데 문제가 발생했습니다.");
                    router.back()
                }
                setProductDetail(res.data);
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        fetchData();
    }, []);
    if (!productDetail) {
        return (<>잘못된 상품입니다.</>)
    }



    // 수량 입력 함수(최대치 재고, 소수점 안 받음 등)
    const quantityHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (/^[0-9]*$/.test(value)) { // 숫자만 허용하는 정규식
            const parsedValue = value === "" ? 0 : parseInt(value, 10);
            // 최대치를 productDetail.stock으로 제한
            if (parsedValue <= productDetail.stock) {
                setQuantity(parsedValue);
            } else {
                alert("상품 재고가 부족합니다.")
                setQuantity(productDetail.stock);
            }
        }
    };


    // 로그인, 주문 수량 체크
    const check = () => {
        // 로그인 상태 확인 (쿠키에서 accessToken 존재 여부 확인)
        const accessToken = getCookie("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            // 로그인 페이지로 리디렉션
            window.location.href = "/user/login";
            return false;
        } else if (quantity === 0 || quantity === null) {
            alert("개수를 정해주세요.");
            return false;
        } else {return true;}

    }

    const cartAddHandler = async () => {
        if(check()){
        const data = {
            productId: productId,
            quantity: quantity
        };

        try {
            const res = await authApi.post("/carts/add", data);
            if (res.status !== 200) {
                alert("장바구니 추가에 실패했습니다.");
                return;
            }
            alert("장바구니에 추가됐습니다.");
        } catch (error) {
            console.error("장바구니 추가 오류:", error);
            alert("장바구니 추가 중 오류가 발생했습니다.");
        }
        }
    }

    const orderOneHandler = () =>{
        if(check()) {
            // 선택된 ID들에 해당하는 cart 항목들을 필터링하여 selectedProductDtos 생성
            const selectedProductDtos: OrderRequestType[] = [{
                productsDto: productDetail, // productDto 그대로 저장
                quantity: quantity       // 수량 저장
            }];
            // sessionStorage에 selectedProductDtos 저장
            sessionStorage.setItem('orderData', JSON.stringify(selectedProductDtos));
            // 주문 페이지로 이동
            router.push("/order");
        }
    }

   const categoryText = (
            <Button onClick={() => router.push(`/category/${productDetail.category}`)}>
                카테고리 : {productDetail.category}
            </Button>
        )

    const brandText = (
            <Button onClick={() => router.push(`/brand/${productDetail.brand}`)}>
                브랜드 : {productDetail.brand}
            </Button>
        )


    const ProductPaper = ({ children }:{children: ReactNode}) => {
        return (
            <Paper sx={{ marginBottom: 2, padding: 2 }}>
                {children}
            </Paper>
        );
    };

    return (
        <Box>
            <Box sx={{ marginTop:5, display: "flex", justifyContent: "center"}}>
                <Box
                    component="img" src={productDetail.imageUrl}
                    sx={{
                        width: "40%", 
                        minWidth: 250,
                        maxWidth: 600,
                        objectFit: "contain"}}/>
                <Box sx={{display: "flexDirection", marginLeft: 5, width: "40%"}}>
                    <Box sx={{marginBottom: 1}}>
                        {categoryText} - {brandText}
                </Box>
                    <Typography variant="h4" sx={{marginBottom:3}}>
                        {productDetail.name}
                    </Typography>
                    <Rating
                        value={averageRating}
                        precision={0.5}
                        readOnly
                        emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                    />
                    {averageRating===0? "아직 리뷰가 없습니다.": ""}
                    <Typography>
                        ₩{productDetail.price}
                    </Typography>
                    <Typography variant="h6" sx={{marginBottom:3}}>
                    현재 가격 : ₩{gradeDiscountPrice(productDetail.price)}
                    </Typography>
                    {productDetail.stock>0?
                        <Box>
                    <TextField type="number"
                               label="구매 수량"
                               value={quantity}
                               onChange={quantityHandler}
                               onKeyDown={(e) => {
                                   if (e.key === '-' || e.key === '.' || e.key === 'e') {
                                       e.preventDefault(); // 음수, 소수점, 지수표기법 입력 방지
                                   }
                               }}
                               size="small"
                    />
                    <Box sx={{display: "flex", marginY:2}}>
                        <Button onClick={orderOneHandler}
                        sx={{backgroundColor: "#FFDF00", color: "#000000", marginRight:2}}>구매하기</Button>
                        <Button onClick={cartAddHandler}
                                sx={{backgroundColor: "#000000", color: "#FFFFFF"}}>장바구니</Button>
                    </Box>
                    </Box>
                     :
                         <Typography variant="h6">
                             현재 재고가 없습니다.
                         </Typography>
                     }
                </Box>
            </Box>
            <Box>
                <Box>
                    <Toolbar sx={{
                        backgroundColor: "#000000", color: "#FFFFFF",
                        width: "100%",
                        justifyContent: "center",
                        height: 40,
                        marginBottom:2}}>
                        <ScrollBox name="상세 설명" id="description"/>
                        <ScrollBox name="리뷰" id="review"/>
                        <ScrollBox name="판매 정책" id="rule"/>
                    </Toolbar>
                    <Box sx={{justifyItems: "center"}}>
                        <Box sx={{maxWidth: "1200px", width: "90%"}}>
                            <ProductPaper>
                        <Typography id="description" variant="h5" sx={{marginBottom: 2}}>
                            상세 설명
                        </Typography>
                        <Typography>
                            {productDetail.description}
                        </Typography>
                            </ProductPaper>

                            <ProductPaper>
                        <Typography id="review" variant="h5" sx={{marginBottom: 2}}>
                            리뷰
                        </Typography>
                        <ReviewList
                            productId={productId}
                            reviewCreateAuth={reviewCreateAuth}
                            setAverageRating={setAverageRating}
                            averageRating={averageRating}
                        />
                            </ProductPaper>
                            <ProductPaper>
                        <Typography id="rule" variant="h5" sx={{marginBottom: 2}}>
                            판매 정책
                        </Typography>
                        <Warranty/>
                            </ProductPaper>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>)
}