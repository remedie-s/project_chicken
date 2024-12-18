
"use client"
import {Box, Button} from "@mui/material";

import {Paper} from "@mui/material";
import {DataGrid, GridColDef, GridEventListener} from '@mui/x-data-grid';
import {useEffect, useState} from "react";
import authApi from "@/scripts/auth/authApi";
import {useRouter} from "next/navigation";
import authErrorLogout from "@/scripts/auth/authErrorLogout";
import axios from "axios";
import {NoticeDto} from "@/types/noticeType";
import timeStyle from "@/scripts/timeStyle";


// TODO 대충 형태만 붙여넣기한 상태, 값 수정 필요
export default function NoticeList() {
    const router = useRouter();
    const paginationModel = {page: 0, pageSize: 5};
    // 데이터 그리드 컬럼 설정
    const columns: GridColDef[] = [
        {field: "title", headerName: "제목", width: 400},
        { field: "createTime", headerName: "작성일", width: 200,
            // 날짜 형식 변환
            valueFormatter: (params) => timeStyle(params),}
    ];
    const [noticeList,setNoticeList] = useState<NoticeDto[]|null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // 기본값 설정
                const res = await axios.get<NoticeDto[]|null>(`${apiUrl}/notice/list`);
                console.log("공지사항 불러오기 "+res.data)
                setNoticeList(res.data);
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };
        fetchData();
    }, []);

    const handleCellClick: GridEventListener<"cellClick"> =
        (notice) => {
            const noticeId = notice.id;
            router.push(`/notice/detail/${noticeId}`); };

    return (
        <Box sx={{ width: "100%"}}>
            <Paper sx={{height: 400, width: '100%'}}>
                <DataGrid
                    rows={noticeList||[]}
                    columns={columns}
                    initialState={{pagination: {paginationModel}}}
                    pageSizeOptions={[5, 10]}
                    sx={{border: 0}}
                    localeText={{
                        noRowsLabel: "조회 가능한 공지사항이 없습니다.",
                    }}
                    onCellClick={handleCellClick} // 셀 클릭 핸들러
                />
            </Paper>
        </Box>
    );
}