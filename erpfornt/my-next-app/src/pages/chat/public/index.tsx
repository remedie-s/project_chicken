import { useState, useEffect, useRef } from "react";
import WebSocketClient from "../../../component/websocketClient";
import { chatPublic } from "../../../api/api"; // API 호출 함수 임포트
import { Box, Typography, TextField, Button, Paper, Avatar } from "@mui/material";

type ChatMessage = {
    sender: string;
    content: string;
};

const ChatPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [email, setEmail] = useState<string>(""); // 이메일 상태 추가
    const [websocketClient, setWebsocketClient] = useState<WebSocketClient | null>(null);
    const inputRef = useRef<HTMLInputElement>(null); // 입력창 참조 추가

    useEffect(() => {
        // 세션스토리지에서 이메일 가져오기
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            // 세션스토리지에서 이메일 가져오기
            const storedData = JSON.parse(accessToken); // 저장된 JSON 데이터 파싱
            const userEmail = storedData.email; // "email" 필드 추출
            setEmail(userEmail); // 상태에 저장
        } catch (error) {
            console.error("세션스토리지 데이터 파싱 오류:", error);
        }

        // WebSocket 클라이언트 초기화
        const client = new WebSocketClient(accessToken, (message: ChatMessage) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });
        setWebsocketClient(client);

        // 전체 채팅 내역 로드
        const loadInitialMessages = async () => {
            try {
                const initialMessages = await chatPublic();
                setMessages(initialMessages); // 초기 메시지를 상태에 설정
            } catch (error) {
                console.error("초기 채팅 내역 로딩 실패:", error);
            }
        };

        loadInitialMessages();

        // 입력창 자동 포커스
        inputRef.current?.focus();

        return () => {
            client.disconnect(); // 컴포넌트 unmount 시 연결 해제
        };
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !websocketClient) return;

        const message: ChatMessage = {
            sender: email, // 현재 유저 이메일 사용
            content: newMessage,
        };

        websocketClient.sendMessage("/app/chat.sendMessage", message); // 서버로 메시지 전송
        setNewMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // 기본 Enter 동작 방지
            handleSendMessage();
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
                전체 채팅
            </Typography>
            <Paper
                sx={{
                    height: "800px",
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
                            justifyContent: msg.sender === email ? "flex-end" : "flex-start",
                            marginBottom: "10px",
                        }}
                    >
                        {msg.sender !== email && (
                            <Avatar sx={{ bgcolor: "#4caf50", width: 32, height: 32, mr: 2 }}>
                                {msg.sender.charAt(0).toUpperCase()}
                            </Avatar>
                        )}
                        <Box
                            sx={{
                                maxWidth: "60%",
                                padding: "10px 15px",
                                backgroundColor:
                                    msg.sender === email ? "#e1f5fe" : "#f1f1f1",
                                borderRadius: "10px",
                                textAlign: "left",
                                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                            }}
                        >
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    fontWeight: "bold",
                                    color: msg.sender === email ? "#0288d1" : "#4caf50",
                                }}
                            >
                                {msg.sender === email ? "나" : msg.sender}
                            </Typography>
                            <Typography variant="body2">{msg.content}</Typography>
                        </Box>
                    </Box>
                ))}
            </Paper>
            <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress} // 엔터키 이벤트 핸들러 추가
                    inputRef={inputRef} // 자동 포커스 설정
                    placeholder="메시지를 입력하세요..."
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
        </Box>
    );
};

export default ChatPage;
