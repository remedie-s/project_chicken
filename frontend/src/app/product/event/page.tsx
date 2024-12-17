
"use client"
import {Box, Typography} from "@mui/material";
import ProductList from "@/components/product/ProductList";
import {useEffect, useState} from "react";
import {ProductsDto} from "@/types/productType";
import axios from "axios";
import CenterBox from "@/components/layout/CenterBox";


export default function eventProductPage () {
    const [products, setProducts] = useState<ProductsDto[] | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/products/list/event");
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
            <Box>
            <Typography variant="h5" sx={{marginBottom: 3}}>
                이벤트 상품 페이지
            </Typography>
            {products ?
                <ProductList products={products}/>
                :
                <CenterBox>
                    현재 대상 물품이 없습니다.
                </CenterBox>
            }
            </Box>
        </CenterBox>
    )
}