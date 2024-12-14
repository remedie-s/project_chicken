import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default class WebSocketClient {
    private client: Client;

    constructor(accessToken: string, onMessage: (message: any) => void, receiver?: string) {
        const socketUrl = `http://localhost:8081/ws?access_token=${accessToken}&receiver=${receiver || ""}`; // 토큰과 receiver를 쿼리 파라미터로 전달

        this.client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: {}, // 헤더를 따로 추가하지 않음, 토큰은 URL에 포함
            debug: (str) => console.log("WebSocket Debug:", str),
            onConnect: () => console.log("WebSocket connected"),
            onDisconnect: () => console.log("WebSocket disconnected"),
            onStompError: (frame) => console.error("WebSocket error:", frame),
        });

        this.client.onWebSocketClose = (evt) => {
            console.error("WebSocket closed:", evt);
        };

        this.client.onUnhandledMessage = (message) => {
            console.log("Unhandled message:", message.body);
        };

        // 구독 설정
        this.client.onConnect = () => {
            if (receiver) {
                this.client.subscribe(`/user/${receiver}/queue/private`, (message) => {
                    onMessage(JSON.parse(message.body));
                });
            } else {
                this.client.subscribe("/topic/public", (message) => {
                    onMessage(JSON.parse(message.body));
                });
            }
        };

        this.client.activate(); // WebSocket 활성화
    }

    sendMessage(destination: string, body: object) {
        this.client.publish({
            destination,
            body: JSON.stringify(body),
        });
    }

    disconnect() {
        this.client.deactivate(); // WebSocket 연결 해제
    }
}
