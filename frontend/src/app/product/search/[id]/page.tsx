
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


    // 이스케이프 처리 함수
    const encodeSearchTerm = (term:string) => {
        // 특수문자 및 공백을 이스케이프 처리
        return term.replace(/\s+/g, '\\s').replace(/[-+*?"&|]/g, '\\$&'); // 여기에 필요한 특수문자 추가
    };

    useEffect(() => {
        if (id && typeof id === "string") {
            const decoded = decodeURIComponent(id);
            setDecodedId(decoded);
        }
    }, [id]);
    useEffect(() => {
        const fetchData = async ()=> {
            // 변수 초기화시 실행되는 거 방지
            if(decodedId===null){return;}
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // 기본값 설정
            // const res = await axios.get(`${apiUrl}/products/search/${decodedId}`)
            const res = await axios.get(`${apiUrl}/products/search/up/${decodedId}`)
            setProductsList(res.data);
        }
        fetchData();
    }, [decodedId]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!id) return;
    //
    //         const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    //         const res = await axios.get(`${apiUrl}/products/search/${id}`);  // 이미 인코딩된 id를 그대로 사용
    //         setProductsList(res.data);
    //     }
    //     fetchData();
    // }, [id]);

    return(
        <CenterBox name={`${decodedId} 검색 결과`}>
            {productsList && productsList.length > 0 ?
                <ProductList products={productsList}></ProductList>
                :
                <CenterBox name="">
                    현재 판매 중인 {decodedId} 상품이 아직 없습니다
                </CenterBox>}
        </CenterBox>
    )
}