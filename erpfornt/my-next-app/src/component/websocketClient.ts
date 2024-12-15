import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export default class WebSocketClient {
    private client: Client;

    constructor(accessToken: string, onMessage: (message: any) => void, receiver?: string) {
        const socketUrl = `http://localhost:8081/ws?access_token=${accessToken}`; // receiver를 URL에 포함하지 않음

        this.client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            connectHeaders: {},
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
                // 개인 메시지 구독
                this.client.subscribe("/user/queue/private", (message) => {
                    onMessage(JSON.parse(message.body));
                });
            } else {
                // 공용 메시지 구독
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
