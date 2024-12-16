
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


// TODO 대충 형태만 붙여넣기한 상태, 값 수정 필요
export default function NoticeList() {
    const router = useRouter();
    const paginationModel = {page: 0, pageSize: 5};
    // 데이터 그리드 컬럼 설정
    const columns: GridColDef[] = [
        {field: "title", headerName: "제목", width: 300},
        {field: "createTime", headerName: "작성일", width: 150},
    ];
    const [noticeList,setNoticeList] = useState<NoticeDto[]|null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<NoticeDto[]|null>("http://localhost:8080/api/notice/list");
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