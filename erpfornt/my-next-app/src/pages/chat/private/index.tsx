import { useState, useEffect } from "react";
import WebSocketClient from "../../../component/websocketClient";
import { chatPrivate, getEmployeeList } from "../../../api/api"; // API 함수 임포트

type ChatMessage = {
    sender: string;
    content: string;
    receiver: string; // 리시버 추가
};

type Employee = {
    id: string;    // 직원 ID
    name: string;  // 직원 이름
    email: string; // 직원 이메일
};

const PrivateChatPage = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]); // 메시지 상태
    const [newMessage, setNewMessage] = useState<string>(""); // 새 메시지 상태
    const [receiver, setReceiver] = useState<string>(""); // 선택된 리시버 이메일
    const [employees, setEmployees] = useState<Employee[]>([]); // 직원 리스트
    const [websocketClient, setWebsocketClient] = useState<WebSocketClient | null>(null); // WebSocket 클라이언트
    const [username, setUsername] = useState<string>(""); // 현재 사용자 이메일

    // 페이지 로드 시 실행되는 useEffect
    useEffect(() => {
        // 액세스 토큰 가져오기
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        // JWT에서 사용자 이메일 추출
        try {
            const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
            const extractedEmail = decodedToken.email;
            setUsername(extractedEmail); // 사용자 이메일 상태 업데이트
        } catch (error) {
            console.error("JWT 디코딩 오류:", error);
        }

        // 직원 리스트 가져오기
        const loadEmployeeList = async () => {
            try {
                const employeeList = await getEmployeeList();
                setEmployees(employeeList);
            } catch (error) {
                console.error("직원 리스트 로딩 실패:", error);
            }
        };

        loadEmployeeList();
    }, []); // 컴포넌트가 처음 렌더링될 때 한 번 실행

    // username 또는 receiver가 변경될 때마다 WebSocket 연결 초기화
    useEffect(() => {
        if (!username || !receiver) return;

        // 개인 채팅 메시지 로드
        const loadPrivateMessages = async () => {
            try {
                const privateMessages = await chatPrivate(username, receiver);
                setMessages(privateMessages); // 기존 메시지 설정
            } catch (error) {
                console.error("개인 채팅 내역 로딩 실패:", error);
            }
        };

        loadPrivateMessages();

        // WebSocket 클라이언트 초기화
        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            const client = new WebSocketClient(
                accessToken,
                (message: ChatMessage) => {
                    console.log("Received message:", message); // 메시지 수신 시 로그 추가
                    setMessages((prevMessages) => [...prevMessages, message]); // 새 메시지 추가
                },
                receiver
            );
            console.log("WebSocketClient initialized:", client); // WebSocketClient 초기화 로그 추가
            setWebsocketClient(client);

            // 컴포넌트 unmount 시 WebSocket 연결 해제
            return () => {
                client.disconnect(); // 연결 해제
            };
        }
    }, [username, receiver]); // username과 receiver가 변경될 때마다 실행

    // 메시지 전송 처리
    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !websocketClient) return;

        const message: ChatMessage = {
            sender: username,
            content: newMessage,
            receiver: receiver, // 리시버 추가
        };

        console.log("Sending message:", message); // 메시지 전송 로그 추가
        websocketClient.sendMessage("/app/chat.privateSendMessage", message); // 개인 메시지 전송
        setNewMessage(""); // 메시지 입력창 비우기
    };

    // 리시버 이메일 선택 변경 처리
    const handleReceiverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setReceiver(e.target.value);
    };

    return (
        <div>
            <h1>개인 채팅</h1>
            <div>
                {/* 직원 목록 선택 */}
                <select onChange={handleReceiverChange} value={receiver}>
                    <option value="" disabled>
                        직원 이메일 선택
                    </option>
                    {employees.map((employee) => (
                        <option key={employee.id} value={employee.email}>
                            {employee.name} ({employee.email})
                        </option>
                    ))}
                </select>
                <button
                    onClick={() => {
                        if (!receiver) alert("직원을 선택하세요!"); // 리시버가 없으면 경고
                    }}
                >
                    채팅 시작
                </button>
            </div>
            {receiver && (
                <div>
                    {/* 메시지 표시 */}
                    <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll" }}>
                        {messages.map((msg, index) => (
                            <p key={index}>
                                <strong>{msg.sender}:</strong> {msg.content}
                            </p>
                        ))}
                    </div>
                    {/* 메시지 입력 */}
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="메시지를 입력하세요..."
                    />
                    <button onClick={handleSendMessage}>전송</button>
                </div>
            )}
        </div>
    );
};

export default PrivateChatPage;
