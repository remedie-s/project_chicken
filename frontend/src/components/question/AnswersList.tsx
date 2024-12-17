import { useEffect, useState } from "react";
import authApi from "@/scripts/auth/authApi";
import { AnswersDto } from "@/types/answerType";
import {Box, Paper, Typography} from "@mui/material";
import timeStyle from "@/scripts/timeStyle";

export default function AnswersList({ questionId }: { questionId: number }) {
    const [answers, setAnswers] = useState<AnswersDto[]>([]);
    // 현재 답변 불러오기 안 만듦
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await authApi.get<AnswersDto[]>(`/questions/detail/${questionId}/answers`);
                if (res.status !== 200) {
                    console.log("답변 불러오기 문제 발생");
                    return;
                }
                setAnswers(res.data);
            } catch (error) {
                console.error("API 요청 오류:", error);
            }
        };

        fetchData();
    }, [questionId]);

    return (
        <Paper sx={{padding: 3}}>
            {answers.length > 0 ?
                answers.map((answer) => (
                    <Box key={answer.id} sx={{
                        borderBottom: '1px solid #ccc', marginBottom: 2 }}>
                        <Typography variant="h6" sx={{marginBottom:1}}>{answer.title}</Typography>
                        <Box sx={{display:"flex", alignItems: "flex-end", flexDirection: "column"}}>
                        <Typography>{timeStyle(answer.createTime)}</Typography>
                        </Box>
                        <Typography>{answer.content}</Typography>
                    </Box>
                ))
                :
                <Typography>아직 답변이 없습니다.</Typography>
            }
        </Paper>
    );
}
