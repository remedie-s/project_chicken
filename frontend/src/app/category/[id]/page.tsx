
"use client"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";
import {ProductsDto} from "@/types/productType";
import {Box, Typography} from "@mui/material";
import ProductList from "@/components/product/ProductList";
import CenterBox from "@/components/layout/CenterBox";

export default function () {
    const { id } = useParams();
    const [decodedId, setDecodedId] = useState<string | null>(null);
    const [productsList,setProductsList] = useState<ProductsDto[]>();

    useEffect(() => {
        if (id && typeof id === "string") {
            setDecodedId(decodeURIComponent(id));
        }
    }, [id]);
    useEffect(() => {
        const fetchData = async ()=> {
            // 변수 초기화시 실행되는 거 방지
            if(decodedId===null){return;}
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // 기본값 설정
            const res = await axios.get(`${apiUrl}/api/products/category/${decodedId}`)
            setProductsList(res.data);
        }
        fetchData();
    }, [decodedId]);

    return(
        <CenterBox>
            <Typography variant="h5" sx={{marginBottom: 3}}>
                {decodedId} 카테고리 상품
            </Typography>
            {productsList && productsList.length > 0 ?
                <ProductList products={productsList}></ProductList>
                :
                <CenterBox>
                    현재 판매 중인 {decodedId} 상품이 아직 없습니다
                </CenterBox>}
        </CenterBox>
    )
}