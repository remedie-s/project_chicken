"use client"
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import authApi from "@/scripts/auth/authApi";
import {Box, Button, TextField} from "@mui/material";
import {QuestionDto} from "@/types/questionType";
import useAuth from "@/scripts/auth/useAuth";
import Loading from "@/app/loading";
import CenterBox from "@/components/layout/CenterBox";

type formType = {
    questionId: number | null,
    modifyRequest: boolean
}

export default function QuestionForm({questionId, modifyRequest}: formType) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [modifyType, setModifyType] = useState(false)
    const { user, loading } = useAuth();
    const router = useRouter();


    useEffect(() => {
        const fetchData = async () => {
            const res = await authApi.get<QuestionDto>(`/qustions/detail/${questionId}`)
            if (res.status !== 200) {
                alert("수정할 문의글 불러오기에 실패했습니다");
                router.back();
            }
            if (user && res.data.userId !== user.id) {
                alert("작성자가 아닙니다.");
                router.back(); // 이전 페이지로 리다이렉트 }
            }
            setTitle(res.data.title);
            setContent(res.data.content);
        }
        if (modifyRequest) {
            setModifyType(true);
            fetchData();
        }
    }, []);

    const check = () => {
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용은 필수입니다.")
            return true;
        }
        return false;
    }

    const createHandler = async () => {
        if (check()) {
            return;
        }
        const data = {
            title: title,
            content: content
        }
        const res = await authApi.post("/questions/create", data);
        if (res.status !== 200) {
            alert("문의 등록에 실패했습니다.");
            return;
        }
        alert("작성 시도 확인");
        router.push("/user/mypage/qa")
    }

    const modifyHandler = async () => {
        if (check()) {
            return;
        }
        const data = {
            title: title,
            content: content
        }
        const res = await authApi.post(`/questions/modify/${questionId}`, data);
        if (res.status !== 200) {
            alert("문의 수정에 실패했습니다.");
            return;
        }
        alert("문의 수정에 성공했습니다.")
        router.push(`/user/mypage/qa/${questionId}`)

    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minWidth: "400px",
            maxWidth: "1000px"
        }}>
            <TextField
                value={title}
                label="제목"
                onChange={(e) => setTitle(e.target.value)}
                sx={{marginY:2}}></TextField>
            <TextField
                value={content}
                label="내용"
                multiline
                minRows={10}
                onChange={(e) => setContent(e.target.value)}></TextField>
            <Box sx={{display: "flex", flexDirection: "row", marginY: 2}}>
            {modifyType ?
                <>
                    <Button onClick={modifyHandler}
                    sx={{ backgroundColor: "#FFDF00", color: "#000000", marginRight: 2}}>작성 완료</Button>
                    <Button onClick={() => router.push(`/user/mypage/qa/${questionId}`)}
                            sx={{ backgroundColor: "#000000", color: "#FFFFFF"}}>작성 취소</Button>
                </>
                :
                <>
                    <Button onClick={createHandler}
                            sx={{ backgroundColor: "#FFDF00", color: "#000000", marginRight: 2}}>작성 완료</Button>
                    <Button onClick={() => router.push("/user/mypage")}
                            sx={{ backgroundColor: "#000000", color: "#FFFFFF"}}>작성 취소</Button>
                </>
            }
            </Box>
        </Box>
    )
}