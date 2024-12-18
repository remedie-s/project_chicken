
import {QuestionDto} from "@/types/questionType";
import {Box, Paper, Typography} from "@mui/material";
import dayjs from "dayjs";
import timeStyle from "@/scripts/timeStyle";

export default function QuestionDetail({question}:{question:QuestionDto}){
    return(
        <Paper sx={{padding:3}}>
            <Typography variant="h5" sx={{marginBottom:3,
                borderBottom: '1px solid #ccc'}}>
                {question.title}
            </Typography>
            <Box sx={{display:"flex", alignItems: "flex-end", flexDirection: "column"}}>
                <Typography>
                    작성일 : {timeStyle(question.createTime)}
                </Typography>
            </Box>
            <Typography sx={{ fontSize: "1.1rem"}}>
                {question.content}
            </Typography>
        </Paper>
    )
}