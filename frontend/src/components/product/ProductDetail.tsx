import {AppBar, Box, Button, Slide, Toolbar, Typography, useScrollTrigger} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Yaldevi} from "next/dist/compiled/@next/font/dist/google";
import {string} from "prop-types";
import axios from "axios";
import {useRouter} from "next/navigation";
import Warranty from "@/components/product/Warranty";

export default function ProductDetail( {productId}:{productId:string}){
    const appbarTrigger = useScrollTrigger();
    const router = useRouter();
    const [productDetail, setProductDetail] = useState("");
    const [productReview, setProductReview] = useState("");
    const dummyProduct = {
            id: 1,
            name: "더미 상품",
            price: 1000,
            createdAt: new Date("2024-11-29"),
            imageUrl: "https://cdn.pixabay.com/photo/2024/01/14/16/30/mountain-range-8508224_640.jpg",
            sellCount: 10
        };

    // useEffect(async () => {
    //     const res = await axios.post("http://localhost:8080/api/products/detail")
    //     if(res.status!==200) {router.push("/"); alert("잘못된 상품 정보입니다."); return;}
    //     setProductDetail(res.data);
    // }, []);


    return(
        <Box>
            <Box  sx={{ display: "flex", alignItems: "center"}}>
                <Box
                    component="img" src={dummyProduct.imageUrl}
                    sx={{width: "40%", minWidth: 250}}/>
                <Box sx={{display: "flex"}}>
                    <Typography  variant="h4" >
                        {dummyProduct.name}
                    </Typography>
                    <br/>
                    <Typography  variant="h6" >
                        {dummyProduct.price}
                </Typography>
                </Box>
            </Box>
            <Box>
                <Box>
                    <Toolbar sx={{backgroundColor: "#000000", color: "#FFFFFF"}}>
                        <Button>상세 설명</Button>
                        <Button>리뷰</Button>
                        <Button>상품 문의</Button>
                        <Button>판매 정책</Button>
                    </Toolbar>
                    <Box>
                        <Typography  variant="h5" >
                        상세 설명
                    </Typography>
                        <Typography >
                        상세 설명 내용
                            {/*{setProductDetail.description}*/}
                    </Typography>
                        <Typography  variant="h5" >
                            리뷰
                        </Typography>
                        <Typography >
                            리뷰 목록
                        </Typography>
                        <Typography  variant="h5" >
                            판매 정책
                        </Typography>
                        <Warranty/>
                    </Box>
                </Box>
            </Box>
        </Box>)
}