import { useState, useEffect } from "react";
import WebSocketClient from "../../../component/websocketClient";
import { chatPrivate, getEmployeeList } from "../../../api/api";

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
    const [messages, setMessages] = useState<ChatMessage[]>([]); // 채팅 메시지 상태
    const [newMessage, setNewMessage] = useState<string>(""); // 새로운 메시지 상태
    const [receiver, setReceiver] = useState<string>(""); // 채팅 상대
    const [employees, setEmployees] = useState<Employee[]>([]); // 직원 리스트
    const [websocketClient, setWebsocketClient] = useState<WebSocketClient | null>(null); // WebSocket 클라이언트
    const [username, setUsername] = useState<string>(""); // 로그인한 사용자 이름
    const [shouldReloadMessages, setShouldReloadMessages] = useState<boolean>(false); // 메시지 강제 로딩 상태

    // 초기 데이터 불러오기 (JWT 디코딩 + 직원 리스트)
    useEffect(() => {
        const accessToken = sessionStorage.getItem("accessToken");
        if (!accessToken) {
            console.error("액세스 토큰 없음 - 로그인 필요");
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            const decodedToken = JSON.parse(atob(accessToken.split(".")[1]));
            const extractedUsername = decodedToken.sub; // JWT의 subject에서 username 추출
            if (!extractedUsername) {
                console.error("JWT에 username 정보 없음");
                return;
            }
            console.log(`JWT 디코딩 성공: username=${extractedUsername}`);
            setUsername(extractedUsername);
        } catch (error) {
            console.error("JWT 디코딩 오류:", error);
        }

        const loadEmployeeList = async () => {
            try {
                const employeeList = await getEmployeeList();
                console.log("직원 리스트 로드 성공:", employeeList);
                setEmployees(employeeList);
            } catch (error) {
                console.error("직원 리스트 로드 실패:", error);
            }
        };

        loadEmployeeList();
    }, []);

    // WebSocket 초기화
    useEffect(() => {
        if (!username || !receiver) {
            console.log("WebSocketClient 초기화 안 됨 - username 또는 receiver 없음");
            return;
        }
        console.log(`WebSocketClient 초기화: username=${username}, receiver=${receiver}`);

        const accessToken = sessionStorage.getItem("accessToken");
        if (accessToken) {
            const client = new WebSocketClient(
                accessToken,
                (message: ChatMessage) => {
                    console.log("수신된 메시지:", message);
                    setMessages((prevMessages) => [...prevMessages, message]);
                },
                receiver
            );
            setWebsocketClient(client);

            // 웹소켓 초기화 후, 메시지 다시 불러오기
            setShouldReloadMessages(true);

            return () => {
                console.log("WebSocket 연결 해제");
                client.disconnect();
            };
        } else {
            console.error("액세스 토큰 없음 - WebSocketClient 생성 실패");
        }

    }, [username, receiver]);

    // 리시버 변경 시 초기 메시지 로드
    useEffect(() => {
        if (!username || !receiver || !shouldReloadMessages) {
            console.log(`chatPrivate 호출: username=${username}, receiver=${receiver}`);
            return; // username, receiver, shouldReloadMessages가 제대로 설정되지 않으면 초기화 안 함
        }

        const loadInitialMessages = async () => {
            console.log(`chatPrivate 호출: username=${username}, receiver=${receiver}`);

            try {
                const initialMessages = await chatPrivate(username, receiver);
                console.log("초기 메시지 로드 성공:", initialMessages);
                setMessages(initialMessages);  // 초기 메시지 설정
                setShouldReloadMessages(false); // 메시지 로딩 완료 후 상태 초기화
            } catch (error) {
                console.error("초기 메시지 로드 실패:", error);
            }
        };

        loadInitialMessages();
    }, [username, receiver, shouldReloadMessages]);
    const handleManualRequest = async () => {
        if (!username || !receiver) return;

        try {
            const messages = await chatPrivate(username, receiver);
            console.log("수동으로 메시지 불러오기:", messages);
        } catch (error) {
            console.error("수동 요청 실패:", error);
        }
    };

    // 메시지 전송
    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !websocketClient) {
            console.error("메시지 전송 실패 - 메시지가 비어있거나 WebSocketClient 없음");
            return;
        }

        const message: ChatMessage = {
            sender: username,
            content: newMessage,
            receiver: receiver,
        };

        console.log("메시지 전송:", message);

        // WebSocket으로 메시지 전송
        websocketClient.sendMessage("/app/chat.privateSendMessage", message);

        // 로컬 상태 업데이트
        setMessages((prevMessages) => [...prevMessages, message]);
        setNewMessage(""); // 입력란 초기화
    };

    // 리시버 변경
    const handleReceiverChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setReceiver(e.target.value);
        setShouldReloadMessages(true); // 리시버 변경 시 이전 메시지를 강제로 불러오도록 설정
        console.log(`리시버 변경: ${e.target.value}`);
    };

    return (
        <div>
            <h1>개인 채팅</h1>
            <div>
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
                <button onClick={handleManualRequest}> 요청 </button>
            </div>
            {receiver && (
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
            )}
        </div>
    );
};

export default PrivateChatPage;
