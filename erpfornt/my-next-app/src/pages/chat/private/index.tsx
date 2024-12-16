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
    Avatar,
} from "@mui/material";

type ChatMessage = {
    sender: string;
    content: string;
    receiver: string;
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
    const [shouldReloadMessages, setShouldReloadMessages] = useState<boolean>(false);

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
            } catch (error) {
                console.error("직원 리스트 로드 실패:", error);
            }
        };

        loadEmployeeList();
    }, []);

    useEffect(() => {
        if (!username || !receiver) return;

        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            const client = new WebSocketClient(
                accessToken,
                (message: ChatMessage) => {
                    setMessages((prevMessages) => [...prevMessages, message]);
                },
                receiver
            );
            setWebsocketClient(client);
            setShouldReloadMessages(true);

            return () => {
                client.disconnect();
            };
        }
    }, [username, receiver]);

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

    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !websocketClient) return;

        const message: ChatMessage = {
            sender: username,
            content: newMessage,
            receiver: receiver,
        };

        websocketClient.sendMessage("/app/chat.privateSendMessage", message);
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage("");
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
                    onChange={(e) => setReceiver(e.target.value)}
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
                        onKeyPress={(e) => {
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
