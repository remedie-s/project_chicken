
"use client"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
import axios from "axios";
import {ProductsDto} from "@/types/productType";
import {Box, Typography} from "@mui/material";
import ProductList from "@/components/product/ProductList";
import CenterBox from "@/components/layout/CenterBox";
import {NoticeDto} from "@/types/noticeType";

export default function () {
    const { id } = useParams();
    const [noticeDetail,setNoticeDetail] = useState<NoticeDto>();

    useEffect(() => {
        const fetchData = async () => {
            const res = await axios.get(`http://localhost:8080/api/notice/detail/${id}`)
            setNoticeDetail(res.data);
        }
        if (id && typeof id === "string") {
            fetchData()
        }
    }, [id]);

    return(
        <CenterBox>
            {noticeDetail?
                <Box>
                    <Typography variant="h5" sx={{marginBottom:3}}>
                    {noticeDetail.title}
                    </Typography>
                    {noticeDetail.content}
                </Box>
                :
                <Typography>
                    존재하지 않거나 볼 수 없는 공지사항입니다.
                </Typography>}
</CenterBox>
    )
}