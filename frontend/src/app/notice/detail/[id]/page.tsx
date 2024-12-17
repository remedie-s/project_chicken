
"use client"
import {useParams} from "next/navigation";
import {useEffect, useState} from "react";
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
            const res = await axios.get(`http://localhost:8080/api/notice/detail/${id}`)
            setNoticeDetail(res.data);
        }
        if (id && typeof id === "string") {
            fetchData()
        }
    }, [id]);

    return(
        <CenterBox>
            <Typography variant="h5" sx={{marginBottom: 3}}>
                공지사항
            </Typography>
            <Paper sx={{padding:3}}>
            {noticeDetail?
                <Box>
                    <Typography variant="h5" sx={{marginBottom:3,
                        borderBottom: '1px solid #ccc'}}>
                    {noticeDetail.title}
                    </Typography>
                    <>
                        {noticeDetail.imageUrl?
                            (<Box
                                // 이미지 크기 조절
                                sx={{
                                    width: "100%",
                                    height: "400px", // 원하는 높이로 설정
                                    backgroundImage: `url(${noticeDetail.imageUrl})`,
                                    backgroundSize: "cover", // 이미지가 전체 박스를 덮도록 설정
                                    backgroundPosition: "center", // 이미지의 중앙을 기준으로 설정
                                    display: "flex", // Flexbox 사용
                                    justifyContent: "space-between", // 좌우로 배치
                                    alignItems: "center", // 세로로 가운데 정렬
                                    maxWidth: "800px"
                                }}
                            ></Box>)
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