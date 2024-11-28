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
}

export default function PasswordChangeScreen ({passwordQuestion, passwordAnswer, setPasswordChange}:passwordQA){
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
        const res = await authApi.get<OrderDto[]|null>("/user/passwordchange");
        if (res.status!==200) { alert("오류 발생으로 가입에 실패하였습니다.");}
        else { alert("성공적으로 가입됐습니다. 로그인해주세요.");}
        router.push("/");
        return;
    }


    return (
        <Box>
            {qacheck?
                <Box>
                    <TextField
                        label="변경할 비밀번호"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <TextField
                        label="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        onClick={qacheckHandler}>
                        확인
                    </Button>
                    <Button
                        onClick={() => setPasswordChange(false)}>
                        변경 취소
                    </Button>
                </Box>
                :
                <Box>
                    패스워드 질문 : {passwordQuestion}
                    <TextField
                        label="답을 적어주세요"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                    <Button
                    onClick={qacheckHandler}>
                        확인
                    </Button>
                    <Button
                        onClick={() => setPasswordChange(false)}>
                        변경 취소
                    </Button>
                </Box>
            }
        </Box>
    )
}
