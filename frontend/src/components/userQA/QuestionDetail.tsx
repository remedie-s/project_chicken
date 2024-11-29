import {Box, Paper, Typography} from "@mui/material";
import {QuestionDto} from "@/types/questionType";

export default function QuestionDetail(){
    const dummyQuestion:QuestionDto = {
        id: 1,
        title: "질문 제목",
        content: "질문 내용",
        createTime: new Date("2024-11-11")
    }

    return(
        <Box>
            <Paper>
                <Typography variant="h4">
                    {dummyQuestion.title}
                </Typography>
                <Typography>
                    {dummyQuestion.content}
                </Typography>
                <Typography>
                    {dummyQuestion.createTime.toString()}
                </Typography>
            </Paper>
        </Box>
    )
}