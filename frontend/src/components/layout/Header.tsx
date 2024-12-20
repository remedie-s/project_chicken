// 사이트 로고, 검색창

'use client'
import {
    Box,
    Button, Menu, MenuItem, Paper, Popper,
    TextField,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import axios from 'axios';
import {useState, useRef, useEffect, MouseEvent} from "react";
import {useRouter} from "next/navigation";
import authLogout from "@/scripts/auth/authLogout";
import logout from "@/scripts/auth/logout"

const cookie = require("cookie");
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PersonIcon from '@mui/icons-material/Person';
import {ProductsDto} from "@/types/productType";


export default function Header() {
    const router = useRouter();
    const [keyword, setKeyword] = useState("");
    const [userName, setUserName] = useState("");
    // 자동 완성 제안 목록
    const [suggestions, setSuggestions] = useState<ProductsDto[]>([]);
    // 검색창 ref
    const inputRef = useRef<HTMLInputElement>(null);
    // 자동완성 항목 클릭 여부
    const [isSelectingSuggestion, setIsSelectingSuggestion] = useState(false);
    // TextField 너비 저장용
    const [inputWidth, setInputWidth] = useState<number>(0); 
    

    const goHome = () => {
        window.location.href="/"
    };
    const logouHandler = () => {
        logout();
    };

    const searchHandler = async () => {
        router.push(`/product/search/${encodeURIComponent(keyword)}`)
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            searchHandler();
        }
    };


    useEffect(() => {
        console.log("useEffect 실행");
        const cookies = document.cookie ? cookie.parse(document.cookie) : {};
        const loginUser = cookies.userName || null;
        if (loginUser) {
            setUserName(loginUser);
        }
    }, []);
    // 검색어 자동 완성
    useEffect(() => {
        // 검색어 빈 값인 경우
        if (!keyword.trim() || isSelectingSuggestion) {
            setSuggestions([]);
            return;
        }
        const timeoutId = setTimeout(async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // 기본값 설정
                const res = await axios.get<ProductsDto[]>(`${apiUrl}/products/autocomplete`, {
                    // string 전달이 잘 안 돼서 params 설정
                    params: {
                        prefix: keyword
                    }
                });
                // 자동완성 결과 업데이트
                setSuggestions(res.data);
            } catch (error) {
                console.error("자동완성 오류:", error);
            }
        }, 300); // 300ms 후에 요청 (디바운스 효과)

        // 이전 요청을 취소하는 cleanup 함수
        return () => {
            clearTimeout(timeoutId);
        };
    }, [keyword, isSelectingSuggestion]);

    useEffect(() => {
        // TextField의 width를 상태로 설정
        if (inputRef.current) {
            setInputWidth(inputRef.current.offsetWidth);
        }
        // keyword 변경 시마다 실행되어 TextField 너비를 최신 상태로 반영
    }, [keyword]);


    const suggestionSelect = (item: ProductsDto) => {
        setKeyword(item.name); // 선택된 항목을 검색어에 반영
        setSuggestions([]); // 자동완성 메뉴 닫기
        setIsSelectingSuggestion(true); // 자동완성 항목 클릭 상태
    };





    return (
        <Box sx={{margin: 1, display: "flex", justifyContent: "center"}}>
            <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "90%",
                alignItems: "center",
                zIndex: 1100
            }}>
                <Box
                    component="img" src="/ToolBox_Logo.png"
                    sx={{height: "70px", width: "auto", objectFit: "contain", margin: '0 10px',}}
                    onClick={goHome}/>
                <Box sx={{display: "flex", alignItems: "center", width: "35%", marginRight: 3}}>
                    <TextField
                        variant="outlined"
                        size="small"
                        id="search"
                        placeholder="상품 검색"
                        sx={{flexGrow: 1, marginRight: 2}}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyPress}
                        inputRef={inputRef} // ref를 통해 focus를 제어할 수 있도록
                        value={keyword}
                    >
                    </TextField>
                    <Button sx={{bgcolor: "#FFDF00", color: "#000000"}} onClick={searchHandler}>
                        <SearchIcon/>
                    </Button>
                </Box>
                {userName ?
                    <Box>
                        <Button
                            sx={{backgroundColor: "#FFDF00", color: "#000000", margin: 1}}
                            onClick={() => {
                                router.push("/cart")
                            }}><ShoppingCartIcon/> 장바구니</Button>
                        <Button
                            sx={{backgroundColor: "#FFDF00", color: "#000000", marginRight: 1}}
                            onClick={() => {
                                router.push("/user/mypage/order")
                            }}> <PersonIcon/>{userName}</Button>
                        <Button
                            sx={{backgroundColor: "#000000", color: "#FFFFFF"}}
                            onClick={logouHandler}>로그아웃</Button>
                    </Box>
                    :
                    <Box>
                        <Button
                            sx={{backgroundColor: "#FFDF00", color: "#000000", margin: 1}}
                            onClick={() => {
                                router.push("/user/login")
                            }}>로그인</Button>
                        <Button
                            sx={{backgroundColor: "#000000", color: "#FFFFFF"}}
                            onClick={() => {
                                router.push("/user/register")
                            }}>회원가입</Button>
                    </Box>
                }
            </Box>
            {/* Popper로 자동완성 메뉴 구현 */}
            <Popper
                open={suggestions.length > 0 && keyword.trim() !== ""}
                anchorEl={inputRef.current}
                placement="bottom-start"
                sx={{ zIndex: 1100 }}
            >
                <Paper sx={{ maxHeight: 200, overflowY: 'auto', width: inputWidth }}>
                    {suggestions.map((item, index) => (
                        <MenuItem key={index} onClick={() => suggestionSelect(item)}>
                            {item.name}
                        </MenuItem>
                    ))}
                </Paper>
            </Popper>
        </Box>
    );
}