"use client"
import {Box, Button, Typography} from "@mui/material";
import FAQList from "@/components/qna/FAQList";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getCookie} from "@/scripts/cookieScript";


export default function servicePage() {
    const router = useRouter();
    const [logined,setLogined] = useState(false);

    useEffect(() => {
        const accessToken = getCookie("accessToken");
        if(accessToken) {setLogined(true);}
    },[])

    const qaMoveHandler = () => {
        if(!logined) {
            alert("로그인이 필요합니다.");
            router.push("/user/login")
            return;
        }
        router.push("/user/mypage/qa");
    }


    return (
        <Box sx={{margin: 3}}>
            <Box>
                <Typography variant="h5">
                    자주 묻는 질문
                </Typography>
                <FAQList/>
            </Box>
            <Typography variant="h5">
                아직 해결이 안 됐다면?
            </Typography>
            <Button
                onClick={qaMoveHandler}
                sx={{bgcolor: "#FFDF00", color: "#000000", margin: 3}}
            >
                    문의 페이지로 (로그인 필요)
        </Button>
</Box>
)
}