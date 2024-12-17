import {Box, Button, TextField} from "@mui/material";
import {useState} from "react";
import axios from "axios";
import authApi from "@/scripts/auth/authApi";
import type {OrderDto} from "@/types/orderType";
import {useRouter} from "next/navigation";


type passwordQA = {
    passwordQuestion: string,
    passwordAnswer: string
    setPasswordChange: (content: boolean) => void;
    email: string
}

export default function PasswordChangeScreen ({passwordQuestion, passwordAnswer, setPasswordChange, email}:passwordQA){
    const [qacheck, setQacheck] = useState(false);
    const [answer, setAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("")
    const router = useRouter();

    const qacheckHandler = () =>{
        if (answer.trim() === '') { alert("답을 입력해주세요"); return; }
        if (answer !==passwordAnswer) { alert("답이 틀렸습니다"); return; }
        else setQacheck(true);
    }
    const passwordChangeHandler = async () => {
        if(!passwordCheck()) {return;}
        const data = {
            email: email,
            password: newPassword
        }
        const res = await axios.post("http://localhost:8080/api/auth/passwordchange", data);
        if (res.status!==200) { alert("비밀번호 변경에 실패했습니다.");}
        else { alert("비밀번호 변경에 성공했습니다."); setPasswordChange(false);}
        return;
    }
    const passwordCheck = () => {
        if(newPassword===null||newPassword.trim().length===0) {alert("변경할 비밀번호를 입력해주세요.");return false;}
        if(confirmPassword===null||confirmPassword.trim().length===0) {alert("비밀번호 확인을 입력해주세요.");return false;}
        if(confirmPassword!==newPassword) {alert("비밀번호 확인이 일치하지 않습니다.");return false;}
        return true;
    }


    return (
        <Box sx={{marginY: 2}}>
            {qacheck?
                <Box>
                    <TextField
                        type="password"
                        label="변경할 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        type="password"
                        label="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        onClick={passwordChangeHandler}>
                        확인
                    </Button>
                    <Button
                        onClick={() => setPasswordChange(false)}>
                        비밀번호 변경 취소
                    </Button>
                </Box>
                :
                <Box>
                    패스워드 질문 : {passwordQuestion}
                    <br/>
                    <TextField
                        label="답을 적어주세요"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        sx={{marginY: 2}}
                    />
                    <br/>
                    <Box sx={{marginBottom:2}}>
                    <Button
                    onClick={qacheckHandler}
                    sx={{backgroundColor: "#FFDF00", color: "#000000", marginRight:2}}>
                        확인
                    </Button>
                    <Button
                        onClick={() => setPasswordChange(false)}
                        sx={{backgroundColor: "#000000", color: "#FFFFFF"}}
                    >
                        변경 취소
                    </Button>
                    </Box>
                </Box>
            }
        </Box>
    )
}
