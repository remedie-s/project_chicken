
import {QuestionDto} from "@/types/questionType";
import {Box, Paper, Typography} from "@mui/material";
import dayjs from "dayjs";

export default function QuestionDetail({question}:{question:QuestionDto}){
    return(
        <Paper>
            <Typography>{question.title}</Typography>
            <Typography>{dayjs(question.createTime).format('YYYY-MM-DD')}</Typography>
            <Box>
            <Typography>{question.content}</Typography>
            </Box>
        </Paper>
    )
}