import React, {ChangeEvent, useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {
    Box, Button,
    Card,
    CardContent,
    FormControl,
    InputLabel, MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {useRouter} from "next/navigation";

export default function RegisterScreen(){
    const [passwordQ, setPasswordQ] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordA, setPasswordA] = useState("");
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [birthday,setBirthday] = useState(dayjs());
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const router = useRouter();


    const questionChange = (e:SelectChangeEvent) => {
        setPasswordQ(e.target.value as string);
    };

    const genderChange = (e:SelectChangeEvent) => {
        setGender(e.target.value as string);
    };
    const birthdayChange = (date:Dayjs|null) =>{
        if (date) { setBirthday(date); }
    };

    const phoneChange = (e:ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        // 숫자만 허용하고 최대 11자리까지만 입력 가능
        if (/^\d*$/.test(value) && value.length <= 11) {
            setPhone(value);
        }
    };

    const formatPhoneNumber = (number: string): string => {
        return `${number.slice(0, 3)}-${number.slice(3, 7)}-${number.slice(7)}`;
    };

    const checkData = () => {
        if(!email) {
            alert("이메일을 입력해주세요.");
            return;
        }
        if(!password) {
            alert("비밀번호를 입력해주세요.");
        }
        if(password!==confirmPassword) {
            alert("비밀번호 확인이 잘못됐습니다.");
            return;
        }
        if(!name) {
            alert("이름을 입력해주세요.");
            return;
        }
        if(!phone) {
            alert("핸드폰 번호를 입력해주세요.");
            return;
        }
        if(phone.length!==11) {
            alert("핸드폰 번호 11자리를 입력해주세요.");
            return;
        }
        if(!gender) {
            alert("성별을 선택해주세요.");
            return;
        }
        if(!address) {
            alert("주소를 입력해주세요.");
            return;
        }
        if(!birthday) {
            alert("생일을 선택해주세요.");
            return;
        }
        if(!passwordQ) {
            alert("비밀번호 변경 질문을 선택해주세요.");
            return;
        }
        if(!passwordA) {
            alert("비밀번호 변경 질문의 정답을 입력해주세요.");
            return;
        }
        return true;
    }


    const registerHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if(!checkData()) return;
        const send = {
            name: name,
            email: email,
            password: password,
            gender: gender,
            address: address,
            birthDate: birthday,
            passwordQuestion: passwordQ,
            passwordAnswer: passwordA,
            phoneNumber: formatPhoneNumber(phone)
        };
        try {
            const res = await axios.post("http://localhost:8080/api/auth/register", send);
            if (res.status !== 200) { console.log("가입실패" + res.data); }
            else {
                alert("성공적으로 가입되었습니다.")
                router.push("/user/login")
            }
        } catch (e: unknown) {
            if(axios.isAxiosError(e)) {
                console.error("오류 상태 코드", e.response?.status);
                console.error("오류 메세지", e.response?.data);
            } else { console.error("오류", (e as Error).message);}
        }
    }

    return (
            <Card sx={{ width: "50%", minWidth:300, maxWidth:600,  margin: 4 }}>
                <Box
                    sx={{
                        marginTop: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography  variant="h5">회원가입</Typography>
                </Box>
                <CardContent>
                    <Box component="form" noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="이메일(아이디)"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e)=>setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type="password"
                            id="password"
                            onChange={(e)=>setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="비밀번호 확인"
                            type="password"
                            id="confirmPassword"
                            helperText={password && password==confirmPassword? "":"비밀번호와 일치하지 않습니다" }
                            onChange={(e)=>setConfirmPassword(e.target.value)}
                        />
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="passwordQLabel">비밀번호 변경시 질문</InputLabel>
                            <Select
                                labelId="passwordQLabel"
                                required
                                fullWidth
                                id="passwordQ"
                                value={passwordQ}
                                label="비밀번호 변경시 질문"
                                onChange={questionChange}
                            >
                                <MenuItem value={"가장 좋아하는 책의 이름은 무엇인가요?"}>가장 좋아하는 책의 이름은 무엇인가요?</MenuItem>
                                <MenuItem value={"가장 좋아하는 동물의 이름은 무엇인가요?"}>가장 좋아하는 동물의 이름은 무엇인가요?</MenuItem>
                                <MenuItem value={"가장 좋아하는 영화 제목은 무엇인가요?"}>가장 좋아하는 영화 제목은 무엇인가요?</MenuItem>
                                <MenuItem value={"가장 좋아하는 색깔은 무엇인가요?"}>가장 좋아하는 색깔은 무엇인가요?</MenuItem>
                                <MenuItem value={"가장 좋아하는 음식은 무엇인가요?"}>가장 좋아하는 음식은 무엇인가요?</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="비밀번호 변경시 정답"
                            value={passwordA}
                            onChange={(e)=>setPasswordA(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="이름"
                            value={name}
                            onChange={(e)=>setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="phone"
                            label="핸드폰 번호"
                            name="phone"
                            onChange={phoneChange}
                            value={phone}
                            helperText="숫자만 입력됩니다"
                        />
                        <FormControl fullWidth margin="normal" required>
                            <InputLabel id="genderLabel">성별</InputLabel>
                            <Select
                                labelId="genderLabel"
                                required
                                fullWidth
                                id="gender"
                                value={gender}
                                label="성별"
                                onChange={genderChange}
                            >
                                <MenuItem value={"male"}>남</MenuItem>
                                <MenuItem value={"female"}>여</MenuItem>
                            </Select>
                        </FormControl>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker onChange={(date) =>birthdayChange(date)} value={birthday} />
                        </LocalizationProvider>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="address"
                            label="주소"
                            name="address"
                            onChange={(e)=>setAddress(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={registerHandler}
                        >
                            회원가입
                        </Button>
                    </Box>
                </CardContent>
            </Card>)
};