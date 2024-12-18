"use client"
import {Box, Button, Typography} from "@mui/material";
import useAuth from "@/scripts/auth/useAuth";
import {useEffect, useState} from "react";
import authApi from "@/scripts/auth/authApi";
import {QuestionDto} from "@/types/questionType";
import QuestionDetail from "@/components/question/QuestionDetail";
import {useRouter, useParams} from "next/navigation";
import axios from "axios";
import authErrorLogout from "@/scripts/auth/authErrorLogout";
import AnswersList from "@/components/question/AnswersList";
import Loading from "@/app/loading";

export default function page() {
    const [question, setQuestion] = useState<QuestionDto | null>(null);
    const { id } = useParams();
    const { user, loading } = useAuth();
    const router = useRouter();

    // TODO 임시 처리
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await authApi.get<QuestionDto | null>(`/questions/detail/${id}`);
                if (res.status !== 200 || res.data === null) {
                    alert("정보를 불러오는데 실패했습니다.");
                    router.push("/user/mypage/qa");
                    return;
                }
                if (user && res.data.userId !== user.id) {
                    alert("해당 문의글 작성자가 아닙니다.");
                    router.back(); // 이전 페이지로 리다이렉트 }
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
    const modifyHandler = () => {
        if (question) {
            router.push(`/mypage/qa/modify/${question.id}`);
        } else {
            console.error("수정하려는 질문이 존재하지 않습니다.");
        }
    }

    return (
        <Box>
            <Typography variant="h5" sx={{marginBottom: 3}}>
                내 문의글 보기
            </Typography>
            {question ?
                <Box>
                    <QuestionDetail question={question}/>
                    <Box sx={{display:"flex", justifyContent: "right", marginY:2}}>
                    <Button onClick={modifyHandler}
                            sx = {{backgroundColor: "#000000", color: "#FFFFFF", marginRight:2}}>수정</Button>
                    <Button onClick={deleteHandler}
                            sx = {{backgroundColor: "#E00000", color: "#FFFFFF"}}>삭제</Button>
                    </Box>
                    <AnswersList questionId={question.id}/>
                </Box>
                :
                <>오류 발생</>}
        </Box>
    )
}