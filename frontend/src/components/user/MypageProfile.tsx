import {Box, Button, Card, CardContent, Typography} from "@mui/material";
import axios from "axios";
import {useState} from "react";
import PasswordChangeScreen from "@/components/user/PasswordChangeScreen";



export default function MypageProfile(){
    const dummy = {
        name: "유저이름",
        email: "이메일",
        createdAt: "가입일",
        gender: "남",
        address: "한가람",
        birthDate: "생일",
        userGrade: 1,   // 없음, 브론즈, 실버, 골드, 플래티넘
        totalPurchaseCount: 10,     // 총 주문 수량
        totalPurchasePrice: 100000,  // 총 주문 금액
        passwordQuestion: "가장 좋아하는 책의 이름은 무엇인가요?",
        passwordAnswer: "책"
    }
    const [passwordChange, setPasswordChange] = useState(false);


    return (
        <Box sx={{width: "80%"}}>
            <Card>
                <CardContent>
                <Typography sx={{fontSize: 15}} >
                    이름 : {dummy.name}
                </Typography>
                <Typography sx={{fontSize: 15}} >
                    이메일 : {dummy.email}
                </Typography>
                <Typography sx={{fontSize: 15}} >
                    가입일 : {dummy.createdAt}
                </Typography>
                <Typography sx={{fontSize: 15}} >
                    주소 : {dummy.address}
                </Typography>
            {passwordChange?
                <PasswordChangeScreen passwordQuestion={dummy.passwordQuestion}
                                      passwordAnswer={dummy.passwordAnswer}
                                      setPasswordChange={setPasswordChange}/>
                :
                <Button
                onClick={()=>setPasswordChange(true)}
                variant="contained"
                sx={{backgroundColor: "#FFA000"}}>
                비밀번호 변경 요청
                </Button>}
                </CardContent>
            </Card>
        </Box>
    )
}