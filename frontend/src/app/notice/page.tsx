import {Box, Typography} from "@mui/material";
import NoticeList from "@/components/Notice/NoticeList";


export default function noticePage () {
    return (
        <Box>
            <Typography variant="h5">
            공지사항 페이지
            </Typography>
            <NoticeList/>
        </Box>
    )
}