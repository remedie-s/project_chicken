import {Box, Typography} from "@mui/material";
import MypageOrder from "@/components/user/MypageOrder";

export default function page(){
    return(
        <Box sx={{width: "95%"}}>
            <Typography variant="h5" sx={{marginBottom: 3}}>
                내 주문 내역
            </Typography>
            <MypageOrder />
        </Box>
    )
}