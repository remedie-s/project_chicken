
"use client"
import {Box, Typography} from "@mui/material";
import ProductList from "@/components/product/ProductList";
import {useEffect, useState} from "react";
import {ProductsDto} from "@/types/productType";
import axios from "axios";
import CenterBox from "@/components/layout/CenterBox";


export default function newProductPage () {
    const [products, setProducts] = useState<ProductsDto[] | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // 기본값 설정
                const res = await axios.get(`${apiUrl}/products/list/new`);
                if (res.status !== 200) {
                    console.log("물품 조회에 실패했습니다")
                };
                setProducts(res.data);
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };
        fetchData();
    }, [])

    return (
        <CenterBox>
            <Typography variant="h5" sx={{marginBottom: 3}}>
                신상품 페이지
            </Typography>
            {products &&products.length!==0 ?
                <ProductList products={products}/>
                :
                <CenterBox>
                    현재 대상 물품이 없습니다.
                </CenterBox>
            }
        </CenterBox>
    )
}