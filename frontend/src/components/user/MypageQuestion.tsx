
"use client"
import {Box, Button} from "@mui/material";

import {Paper} from "@mui/material";
import {DataGrid, GridColDef, GridEventListener} from '@mui/x-data-grid';
import {QuestionDto} from "@/types/questionType";
import {useEffect, useState} from "react";
import axios from "axios";
import useAuth from "@/scripts/auth/useAuth";
import authApi from "@/scripts/auth/authApi";
import {useRouter} from "next/navigation";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import authErrorLogout from "@/scripts/auth/authErrorLogout";
import timeStyle from "@/scripts/timeStyle";

export default function MypageQuestion() {
    const router = useRouter();
    const paginationModel = {page: 0, pageSize: 5};
    // 데이터 그리드 컬럼 설정
    const columns: GridColDef[] = [
        {field: "title", headerName: "문의명", width: 300},
        { field: "createTime", headerName: "작성일", width: 200,
            // 날짜 형식 변환
            valueFormatter: (params) => timeStyle(params),},
        {
            field: "answerCheck",
            headerName: "답변 여부",
            width: 100,
            renderCell: (question) => (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                {question.value ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
                </Box>
                )
        }
    ];

    const [questionList,setQuestionList] = useState<QuestionDto[]|null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await authApi.get<QuestionDto[]|null>("/questions/list");
                setQuestionList(res.data);
            } catch (error) {
                console.error('API 요청 오류:', error);
                authErrorLogout();
            }
        };
        fetchData();
    }, []);

    const handleCellClick: GridEventListener<"cellClick"> =
        (question) => {
        const questionId = question.id;
        router.push(`/user/mypage/qa/${questionId}`); };

    return (
        <Box sx={{ width: "100%"}}>
            <Button
                onClick={()=>router.push("/user/mypage/qa/create")}
                sx={{backgroundColor: "#FFDF00", color: "#000000", marginBottom: 2}}
            >문의 작성</Button>
            <Paper sx={{height: 400, width: '100%'}}>
            <DataGrid
                rows={questionList||[]}
                columns={columns}
                initialState={{pagination: {paginationModel}}}
                pageSizeOptions={[5, 10]}
                sx={{border: 0}}
                localeText={{
                    noRowsLabel: "아직 작성하신 문의가 없습니다.",
                }}
                onCellClick={handleCellClick} // 셀 클릭 핸들러
            />
        </Paper>
        </Box>
    );
}