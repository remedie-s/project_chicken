
"use client"
import {Box, Button, TextField} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import authApi from "@/scripts/auth/authApi";
import {useRouter} from "next/navigation";

export default function page(){
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const router = useRouter();

    const CreateHandler = async () =>{
        const data = {
            title: title,
            content: content
        }
        const res = await authApi.post("/questions/create", data);
        if(res.status!==200){alert("문의 등록에 실패했습니다."); return;}
        router.push("/user/mypage/qa")
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            width: "60%"
        }}>
            <TextField onChange={(e)=>setTitle(e.target.value)}></TextField>
            <TextField onChange={(e)=>setContent(e.target.value)}></TextField>
            <Button onClick={CreateHandler}>작성 완료</Button>
            <Button onClick={()=>router.push("/user/mypage")}>작성 취소</Button>
        </Box>
    )
}