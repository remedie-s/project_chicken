
"use client"
import {Box} from "@mui/material";
import QuestionDetail from "@/components/userQA/QuestionDetail";
import authPage from "@/scripts/auth/authPage";
import {useEffect, useState} from "react";
import authApi from "@/scripts/auth/authApi";
import {QuestionDto} from "@/types/questionType";

export default function page(){
    const [question, setQuestion] = useState<QuestionDto|null>();
    
    // TODO 차후 링크 수정
    useEffect(() => {
        authPage();
        const fetchData = async () => {
            try {
                const res = await authApi.get<QuestionDto|null>("/orders/list");
                if (res.status!==200) {alert("정보를 불러오는데 실패했습니다."); return;}
                setQuestion(res.data);
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        fetchData();
    }, []);

    return(
        <Box>
            <QuestionDetail/>
        </Box>
    )
}