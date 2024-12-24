import { useState, useEffect } from "react";
import WebSocketClient from "../../../component/websocketClient";
import { chatPrivate, getEmployeeList } from "../../../api/api";
import {
    Box,
    Typography,
    Select,
    MenuItem,
    Paper,
    TextField,
    Button,
    Avatar, SelectChangeEvent,
} from "@mui/material";
import {SelectChangeEventType} from "@mui/base";

type ChatMessage = {
    sender: string;
    content: string;
    receiver: string;
    senderId: string;
    receiverId: string;
};

type Employee = {
    id: string;
    name: string;
    email: string;
};

const PrivateChatPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [receiver, setReceiver] = useState<string>("");
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [websocketClient, setWebsocketClient] = useState<WebSocketClient | null>(null);
    const [username, setUsername] = useState<string>("");
    // 채팅방 구독 주소 관리
    const [userId, setUserId] = useState<string>("");
    const [shouldReloadMessages, setShouldReloadMessages] = useState<boolean>(false);
    const [userEmail,setUserEmail] = useState("");


    useEffect(() => {
        console.log("유저이메일 체크"+userEmail)
        if(!userEmail || userEmail.trim().length===0) return;
        // useremail 일치하는 직원 찾기
        const currentUser = employees.find(employee => employee.email === userEmail);
        if (currentUser) {
            console.log("currentUser 찾음"+currentUser.name+currentUser.id)
            // userId 설정
            setUserId(currentUser.id); // userId 설정
        }
    }, [userEmail,employees]);


    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
            const extractedUsername = decodedToken.sub;
            setUsername(extractedUsername);
        } catch (error) {
            console.error("JWT 디코딩 오류:", error);
        }

        const loadEmployeeList = async () => {
            try {
                const employeeList = await getEmployeeList();
                setEmployees(employeeList);
                const seEmail = sessionStorage.getItem("email");
                if(seEmail){
                setUserEmail(seEmail);
            }
            } catch (error) {
                console.error("직원 리스트 로드 실패:", error);
            }
        };

        loadEmployeeList();
    }, []);


    useEffect(() => {
        if (!username || !receiver || !shouldReloadMessages) return;

        const loadInitialMessages = async () => {
            try {
                const initialMessages = await chatPrivate(username, receiver);
                setMessages(initialMessages);
                setShouldReloadMessages(false);
            } catch (error) {
                console.error("초기 메시지 로드 실패:", error);
            }
        };

        loadInitialMessages();
    }, [username, receiver, shouldReloadMessages]);
    
    // 메세지 보내기
    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !websocketClient) return;

        const selectedEmployee = employees.find(employee => employee.email === receiver);

        if (!selectedEmployee) {
            console.error("선택된 사용자 정보 없음");
            return;
        }
        const message: ChatMessage = {
            sender: username,
            content: newMessage,
            receiver: receiver,
            senderId: userId,
            receiverId: selectedEmployee.id,
        };

        websocketClient.sendMessage("/app/chat.privateSendMessage", message);
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage("");
    };

    // 수신자 변경
    const handleReceiverChange = (e: SelectChangeEvent<string>) => {
        setReceiver(e.target.value);
        const selectedEmployee = employees.find(employee => employee.email === e.target.value);

        if (selectedEmployee) {
            const lessId = Math.min(Number(userId), Number(selectedEmployee.id));
            const greaterId = Math.max(Number(userId), Number(selectedEmployee.id));
            const chatRoomId = `${lessId}-${greaterId}`;

            // 기존 websocketClient 구독 취소 및 새로운 구독 설정
            if (websocketClient) {
                websocketClient.disconnect();
            }

            const accessToken = sessionStorage.getItem("accessToken");
            if (accessToken) {
                const client = new WebSocketClient(
                    accessToken,
                    (message: ChatMessage) => {
                        setMessages((prevMessages) => [...prevMessages, message]);
                    },
                    chatRoomId
                );
                setWebsocketClient(client);
                setShouldReloadMessages(true);
            }
        }
    };


    return (
        <Box
            sx={{
                maxWidth: "800px",
                margin: "auto",
                mt: 4,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                padding: 3,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            }}
        >
            <Typography variant="h5" align="center" gutterBottom>
                개인 채팅
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Select
                    value={receiver}
                    onChange={handleReceiverChange}
                    displayEmpty
                    sx={{ width: "100%" }}
                >
                    <MenuItem value="" disabled>
                        직원 이메일 선택
                    </MenuItem>
                    {employees.map((employee) => (
                        <MenuItem key={employee.id} value={employee.email}>
                            {employee.name} ({employee.email})
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            <Paper
                sx={{
                    height: "500px",
                    overflowY: "auto",
                    padding: 2,
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e0e0e0",
                }}
            >
                {messages.map((msg, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            justifyContent: msg.sender === username ? "flex-end" : "flex-start",
                            marginBottom: "10px",
                        }}
                    >
                        {msg.sender !== username && (
                            <Avatar sx={{ bgcolor: "#4caf50", width: 32, height: 32, mr: 2 }}>
                                {msg.sender.charAt(0).toUpperCase()}
                            </Avatar>
                        )}
                        <Box
                            sx={{
                                maxWidth: "60%",
                                padding: "10px 15px",
                                backgroundColor:
                                    msg.sender === username ? "#e1f5fe" : "#f1f1f1",
                                borderRadius: "10px",
                                textAlign: "left",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: "bold",
                                    color: msg.sender === username ? "#0288d1" : "#4caf50",
                                }}
                            >
                                {msg.sender === username ? "나" : msg.sender}
                            </Typography>
                            <Typography variant="body2">{msg.content}</Typography>
                        </Box>
                    </Box>
                ))}
            </Paper>
            {receiver && (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendMessage}
                        sx={{ minWidth: "100px" }}
                    >
                        전송
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default PrivateChatPage;
