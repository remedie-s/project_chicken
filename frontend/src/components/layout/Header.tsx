// 사이트 로고, 검색창

'use client'
import {
    AppBar,
    Box,
    Button,
    IconButton,
    TextField,
    Toolbar,
    Typography,
    Container
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import {useState, useRef, useEffect} from "react";
import {useRouter} from "next/navigation";
const cookie = require("cookie");

type userNameType = {
    userName:string
};

export default function Header({userName}:userNameType){
    const [searchText,setSearchText] = useState("");
    const router = useRouter();
    const keyword = useRef("");

    const search = async () => {
        await axios.post("http://localhost:8080/api/product/search", searchText)
    }
    const goHome = () =>{
        router.push("/")
    }
    const logouHandler = () => {
        // 쿠키에서 토큰과 사용자 정보 삭제
        document.cookie = cookie.serialize('accessToken', '', { maxAge: -1, path: '/' });
        document.cookie = cookie.serialize('refreshToken', '', { maxAge: -1, path: '/' });
        document.cookie = cookie.serialize('userName', '', { maxAge: -1, path: '/' });
        // 로그아웃시 새로고침
        router.push("/")
    };

    return (
        <Box>
            <Box sx={{ display: "flex", alignItems: "center", padding: "10px" }}>
                <Box
                    component="img" src="/ToolBox_Logo.png"
                    sx={{ height: "70px", width: "auto", objectFit: "contain", marginRight: 2, }}
                    onClick={goHome}/>
                <TextField variant="outlined" size="small" placeholder="상품 검색" sx={{ flexGrow: 1, marginRight: 2 }} />
                {userName?
                <Box>
                    <Button
                        sx={{ backgroundColor: "#FFDF00", color: "#000000", marginRight: 1 }}
                        onClick={()=>{router.push("/user/mypage")}}>{userName}</Button>
                    <Button
                        sx={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                        onClick={logouHandler}>로그아웃</Button>
                </Box>
                    :
                <Box>
                <Button
                    sx={{ backgroundColor: "#FFDF00", color: "#000000", marginRight: 1 }}
                onClick={()=>{router.push("/user/login")}}>로그인</Button>
                <Button
                    sx={{ backgroundColor: "#000000", color: "#FFFFFF" }}
                    onClick={()=>{router.push("/user/register")}}>회원가입</Button>
                </Box>
                }
            </Box>
        </Box>
    );
}