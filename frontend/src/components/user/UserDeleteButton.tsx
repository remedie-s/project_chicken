import {Box, Button, TextField, Typography} from "@mui/material";
import {useRef, useState} from "react";
import axios from "axios";
import authApi from "@/scripts/auth/authApi";
import authLogout from "@/scripts/auth/authLogout";


export default function UserDeleteButton() {
    const [checkDelete, setCheckDelete] = useState(false);
    const [confirm, setConfirm] = useState("");

    const checkDeleteHandler = () => {
        setCheckDelete(true);
    };

    const DeleteHandler = async () => {
        if (confirm !== "탈퇴") {
            alert("다시 입력해주세요.");
            return;
        }
        const res = await authApi.post("/users/delete")
        if (res.status !== 200) {
            alert("회원 탈퇴에 실패했습니다.");
            return;
        }
        alert("회원 탈퇴에 성공했습니다.")
        authLogout();
    };

    return (
        <Box sx={{marginY: 2}}>
            {checkDelete ?

                <Box>
                    <Typography>
                        정말 탈퇴하시려면 "탈퇴"라고 입력해주세요.
                    </Typography>
                    <TextField onChange={(e) => setConfirm(e.target.value)}
                    sx={{ marginBottom:2}}/>
                    <br/>
                    <Button onClick={DeleteHandler}
                            sx={{backgroundColor: "#E00000", color: "#FFFFFF", marginRight: 2}}>탈퇴</Button>
                    <Button onClick={() => setCheckDelete(false)}
                            sx={{backgroundColor: "#FFDF00", color: "#000000"}}>탈퇴 취소</Button>
                </Box>
                :
                <Button onClick={checkDeleteHandler} sx={{backgroundColor: "#E00000", color: "#FFFFFF"}}>
                    계정 삭제
                </Button>
            }

        </Box>
    )
}