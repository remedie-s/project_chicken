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
import authLogout from "@/scripts/auth/authLogout";
import logout from "@/scripts/auth/logout"
const cookie = require("cookie");

type userNameType = {
    userName:string
};

export default function Header({userName}:userNameType){
    const router = useRouter();
    const [keyword, setKeyword] = useState("");

    const goHome = () =>{
        router.push("/")
    }
    const logouHandler = () => {
        logout();
    };

    const searchHandler = async () =>{
        router.push(`/product/search/${keyword}`)
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            searchHandler();
        }
    };


    return (
        <Box sx={{ margin: 1}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems:"center", zIndex: 1100}}>
                <Box
                    component="img" src="/ToolBox_Logo.png"
                    sx={{ height: "70px", width: "auto", objectFit: "contain", margin: '0 10px', }}
                    onClick={goHome}/>
                <Box sx={{display: "flex", alignItems:"center", width: "50%", marginRight: 3 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="상품 검색"
                    sx={{ flexGrow: 1, marginRight: 2 }}
                    onChange={(e)=>setKeyword(e.target.value)}
                    onKeyDown={handleKeyPress}
                >
                </TextField>
                    <Button sx={{bgcolor: "#FFDF00"}} onClick={searchHandler}>
                <SearchIcon />
                    </Button>
                </Box>
                {userName?
                <Box>
                    <Button
                        sx={{ backgroundColor: "#FFDF00", color: "#000000", marginRight: 1 }}
                        onClick={()=>{router.push("/cart")}}>장바구니</Button>
                    <Button
                        sx={{ backgroundColor: "#FFDF00", color: "#000000", marginRight: 1 }}
                        onClick={()=>{router.push("/user/mypage/order")}}>{userName}</Button>
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