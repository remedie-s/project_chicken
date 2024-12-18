import {Box, Typography} from "@mui/material";
import NoticeList from "@/components/Notice/NoticeList";
import CenterBox from "@/components/layout/CenterBox";


export default function noticePage () {
    return (
        <CenterBox name="공지사항">
            <NoticeList/>
        </CenterBox>
    )
}