import { useEffect, useState } from "react";
import { requestPermission, onMessageListener } from "../utils/firebase";
import {storeToken} from "@/api/api";
import {NotificationPayload} from "@/api/datatype";

export const useFCM = () => {
    const [notification, setNotification] = useState<NotificationPayload | null>(null);

    useEffect(() => {
        const initFCM = async () => {
            const token = await requestPermission();
            if (token) {
                await storeToken({ token });
                console.log("FCM Token stored successfully");
            }
        };

        initFCM();


        // onMessageListener는 Promise를 반환하므로, 이를 사용하여 메세지 수신을 처리
        const unsubscribe = onMessageListener()
            .then((payload) => {
                console.log("Received foreground message: ", payload);
                const { title, body, icon } = payload.notification;
                setNotification({ title, body, icon });
            })
            .catch((error) => {
                console.error("Error listening to messages: ", error);
            });

        // useEffect가 종료되면 FCM 리스너를 정리하는 함수 반환
        return () => {
            // Firebase onMessage 리스너를 취소하는 방식으로 unsubscribe 사용
            unsubscribe.catch(() => {});
            console.log("FCM listener cleaned up.");
        };
    }, []);

    return { notification };
};