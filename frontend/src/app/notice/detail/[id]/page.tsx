
"use client"
import {useParams} from "next/navigation";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {ProductsDto} from "@/types/productType";
import {Box, Paper, Typography} from "@mui/material";
import ProductList from "@/components/product/ProductList";
import CenterBox from "@/components/layout/CenterBox";
import {NoticeDto} from "@/types/noticeType";
import timeStyle from "@/scripts/timeStyle";

export default function () {
    const { id } = useParams();
    const [noticeDetail,setNoticeDetail] = useState<NoticeDto>();

    useEffect(() => {
        const fetchData = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // 기본값 설정
            const res = await axios.get(`${apiUrl}/notice/detail/${id}`)
            setNoticeDetail(res.data);
        }
        if (id && typeof id === "string") {
            fetchData()
        }
    }, [id]);

    return(
        <CenterBox name="공지사항">
            <Paper sx={{padding:3, width: "90%", maxWidth: "1400px"}}>
            {noticeDetail?
                <Box>
                    <Typography variant="h5" sx={{marginBottom:3,
                        borderBottom: '1px solid #ccc'}}>
                    {noticeDetail.title}
                    </Typography>
                    <>
                        {noticeDetail.imageUrl?
                            (<Box
                                component="img" src={noticeDetail.imageUrl}
                                sx={{
                                    width: "40%",
                                    minWidth: 250,
                                    maxWidth: 800,
                                    objectFit: "contain"}}/>)
                            :
                                (<></>)
                        }
                    </>
                    <Box sx={{display:"flex", alignItems: "flex-end", flexDirection: "column"}}>
                        <Typography>
                        작성일 : {timeStyle(noticeDetail.createTime)}
                        </Typography>
                        {noticeDetail.updateTime?
                            (<Typography>
                        수정일 : {timeStyle(noticeDetail.updateTime)}
                                </Typography>)
                            :
                                (<></>)
                            }
                    </Box>
                    <Typography sx={{ fontSize: "1.1rem"}}>
                    {noticeDetail.content}
                    </Typography>
                </Box>
                :
                <Typography>
                    존재하지 않거나 볼 수 없는 공지사항입니다.
                </Typography>}
            </Paper>
</CenterBox>
    )
}