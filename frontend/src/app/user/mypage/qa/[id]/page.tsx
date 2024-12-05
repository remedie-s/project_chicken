"use client"
import {Box, Button} from "@mui/material";
import authPage from "@/scripts/auth/authPage";
import {useEffect, useState} from "react";
import authApi from "@/scripts/auth/authApi";
import {QuestionDto} from "@/types/questionType";
import QuestionDetail from "@/components/question/QuestionDetail";
import {useRouter} from "next/navigation";
import axios from "axios";
import authErrorLogout from "@/scripts/auth/authErrorLogout";

export default function page({params}: { params: { id: string } }) {
    const [question, setQuestion] = useState<QuestionDto | null>(null);
    const {id} = params;
    const router = useRouter();


    // TODO 차후 링크 수정
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await authApi.get<QuestionDto | null>(`/questions/detail/${id}`);
                if (res.status !== 200 || res.data === null) {
                    alert("정보를 불러오는데 실패했습니다.");
                    router.push("/user/mypage/qa");
                    return;
                }
                setQuestion(res.data);
            } catch (error) {
                console.error('API 요청 오류:', error);
                alert("접근 권한이 없습니다.")
                router.push("/");
            }
        };

        fetchData();
    }, [id, router]);
    const deleteHandler = async () => {
        const confirm = window.confirm("정말로 이 문의글을 삭제하시겠습니까?");
        if (!confirm) {
            return; // 사용자가 취소를 선택하면 함수 종료
        }
        try {
            const res = await authApi.post(`/questions/delete/${id}`);
            if (res.status !== 200 || res.data === null) {
                alert("삭제에 실패했습니다.");
                return;
            }
            alert("문의글이 삭제됐습니다.")
            router.push("/user/mypage/qa");
        } catch (error) {
            console.error('API 요청 오류:', error);
            alert("삭제에 실패했습니다.");
            return;
        }
    }

    return (
        <Box>
            {question ?
                <Box>
                    <QuestionDetail question={question}/>
                    <Button onClick={deleteHandler}>삭제</Button>
                </Box>
                :
                <>오류 발생</>}
        </Box>
    )
}