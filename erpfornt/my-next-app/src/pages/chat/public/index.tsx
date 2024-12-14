import { useState, useEffect } from "react";
import WebSocketClient from "../../../component/websocketClient";
import { chatPublic } from "../../../api/api"; // API 호출 함수 임포트

type ChatMessage = {
    sender: string;
    content: string;
};

const ChatPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState<string>("");
    const [username, setUsername] = useState<string>(""); // 유저 이름 상태 추가
    const [websocketClient, setWebsocketClient] = useState<WebSocketClient | null>(null);

    useEffect(() => {
        // 액세스 토큰 가져오기
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        // JWT 토큰에서 유저 이름 추출
        try {
            const decodedToken = JSON.parse(atob(accessToken.split(".")[1])); // JWT 디코딩
            const extractedUsername = decodedToken.username; // JWT에 포함된 "username" 정보
            setUsername(extractedUsername); // 상태에 저장
        } catch (error) {
            console.error("JWT 디코딩 오류:", error);
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

        return () => {
            client.disconnect(); // 컴포넌트 unmount 시 연결 해제
        };
    }, []);

    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !websocketClient) return;

        const message: ChatMessage = {
            sender: username, // 현재 유저 이름 사용
            content: newMessage,
        };

        websocketClient.sendMessage("/app/chat.sendMessage", message); // 서버로 메시지 전송
        setNewMessage("");
    };

    return (
        <div>
            <h1>전체 채팅</h1>
            <div>
                <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll" }}>
                    {messages.map((msg, index) => (
                        <p key={index}>
                            <strong>{msg.sender}:</strong> {msg.content}
                        </p>
                    ))}
                </div>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="메시지를 입력하세요..."
                />
                <button onClick={handleSendMessage}>전송</button>
            </div>
        </div>
    );
};

export default ChatPage;
