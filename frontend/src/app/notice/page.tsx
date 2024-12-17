import {Box, Typography} from "@mui/material";
import NoticeList from "@/components/Notice/NoticeList";
import CenterBox from "@/components/layout/CenterBox";


export default function noticePage () {
    return (
        <CenterBox>
            <Box sx={{display: "flex", flexDirection: "column"}}>
            <Typography variant="h5" sx={{marginBottom: 3}}>
            공지사항 페이지
            </Typography>
            <NoticeList/>
            </Box>
        </CenterBox>
    )
}