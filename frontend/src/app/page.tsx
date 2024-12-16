
"use client"

import {Box} from "@mui/material";
import Layout from "./layout"
import {ProductsDto} from "@/types/productType";
import dayjs from "dayjs";
import ProductList from "@/components/product/ProductList";
import {useEffect, useState} from "react";
import axios from "axios";
import Banner from "@/components/layout/Banner";
import CenterBox from "@/components/layout/CenterBox";


export default function index() {
    const [products, setProducts] = useState<ProductsDto[] | null>(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/api/products/list/all");
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
        <Box sx={{ flex: 1 }}>
            <Banner/>
            {products ?
                <ProductList products={products}/>
                :
                <CenterBox>
                    현재 판매 물품이 없습니다.
                </CenterBox>
            }
        </Box>
    )
}