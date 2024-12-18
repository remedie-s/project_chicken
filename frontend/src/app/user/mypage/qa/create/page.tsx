
import QuestionForm from "@/components/question/QuestionForm";
import {Box, Typography} from "@mui/material";


export default function page(){
    return (
        <Box>
    <Typography variant="h5" sx={{marginBottom: 3}}>
        1:1 문의 작성
    </Typography>
        <QuestionForm questionId={null} modifyRequest={false}/>
</Box>
    )
}