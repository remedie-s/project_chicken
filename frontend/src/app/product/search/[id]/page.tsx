
"use client"
import {Box, Typography} from "@mui/material";
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {ProductsDto} from "@/types/productType";
import axios from "axios";
import ProductList from "@/components/product/ProductList";
import CenterBox from "@/components/layout/CenterBox";
export default function page() {
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
            const res = await axios.get(`${apiUrl}/products/search/${decodedId}`)
            setProductsList(res.data);
        }
        fetchData();
    }, [decodedId]);

    return(
        <CenterBox name={`${id} 검색 결과`}>
            {productsList && productsList.length > 0 ?
                <ProductList products={productsList}></ProductList>
                :
                <CenterBox name="">
                    현재 판매 중인 {decodedId} 상품이 아직 없습니다
                </CenterBox>}
        </CenterBox>
    )
}