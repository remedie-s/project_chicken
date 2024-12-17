import {Box, Typography} from "@mui/material";
import MypageProfile from "@/components/user/MypageProfile";

export default function page() {
    return (
        <Box sx={{width: "95%"}}>
            <Typography variant="h5" sx={{marginBottom: 3}}>
                내 정보 관리
            </Typography>
            <MypageProfile/>
        </Box>
    )
}