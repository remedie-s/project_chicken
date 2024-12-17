
import {Box, Typography} from "@mui/material";
import MypageQuestion from "@/components/user/MypageQuestion";
import CenterBox from "@/components/layout/CenterBox";

export default function page(){
    return(
        <Box sx={{width: "95%"}}>
            <Typography variant="h5" sx={{marginBottom: 3}}>
                1:1 문의 페이지
            </Typography>
            <MypageQuestion />
        </Box>
    )
}