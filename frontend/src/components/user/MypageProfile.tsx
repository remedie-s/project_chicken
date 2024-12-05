
"use client"
import {Box, Button, Card, CardContent, Typography} from "@mui/material";
import axios from "axios";
import {useEffect, useState} from "react";
import PasswordChangeScreen from "@/components/user/PasswordChangeScreen";
import authPage from "@/scripts/auth/authPage";
import authApi from "@/scripts/auth/authApi";
import type {OrderDto} from "@/types/orderType";
import type {UsersDto} from "@/types/userType"
import dayjs from "dayjs";
import UserDeleteButton from "@/components/user/UserDeleteButton";


export default function MypageProfile() {
    const [passwordChange, setPasswordChange] = useState(false);
    const [userDetail, setUserDetail] = useState<UsersDto | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await authApi.get<UsersDto | null>("/users/detail");
                if (res.status === 200) setUserDetail(res.data);
            } catch (error) {
                console.error('API 요청 오류:', error);
            }
        };

        fetchData();
    }, []);

    const gradeText = [
        "BASIC", "SILVER", "GOLD", "VIP"
    ]


    return (
        <Box sx={{width: "100%"}}>
            <Card>
                {userDetail ?
                    <CardContent>
                        <Typography sx={{fontSize: 15}}>
                            이름 : {userDetail.name}
                        </Typography>
                        <Typography sx={{fontSize: 15}}>
                            이메일 : {userDetail.email}
                        </Typography>
                        <Typography sx={{fontSize: 15}}>
                            가입일 : {dayjs(userDetail.createdAt).format('YYYY-MM-DD')}
                        </Typography>
                        <Typography sx={{fontSize: 15}}>
                            주소 : {userDetail.address}
                        </Typography>
                        <Typography sx={{fontSize: 15}}>
                            회원등급 : {gradeText[userDetail.userGrade]}
                        </Typography>
                        {passwordChange ?
                            <PasswordChangeScreen passwordQuestion={userDetail.passwordQuestion}
                                                  passwordAnswer={userDetail.passwordAnswer}
                                                  setPasswordChange={setPasswordChange}
                                                  email={userDetail.email}
                            />
                            :
                            <Button
                                onClick={() => setPasswordChange(true)}
                                variant="contained"
                                sx={{backgroundColor: "#FFA000"}}>
                                비밀번호 변경 요청
                            </Button>}
                        <UserDeleteButton/>
                    </CardContent>
                    :
                    <CardContent>
                        사용자 정보를 불러오지 못 했습니다.
                    </CardContent>
                }
            </Card>
        </Box>
    )
}