import { useEffect, useState } from "react";
import { requestPermission, onMessageListener } from "../utils/firebase";
import { storeToken } from "@/api/api";
import {NotificationPayload} from "@/types/fcmType";


export const useFCM = () => {
    const [notification, setNotification] = useState<NotificationPayload | null>(null);

    useEffect(() => {
        const initFCM = async () => {
            try {
                const token = await requestPermission();
                if (token) {
                    await storeToken({ token });
                    console.log("FCM Token stored successfully");
                }
            } catch (error) {
                console.error("Error initializing FCM:", error);
            }
        };

        const setupMessageListener = () => {
            onMessageListener()
                .then((payload) => {
                    console.log("Received foreground message: ", payload);
                    const { title, body, icon } = payload.notification;
                    setNotification({ title, body, icon });
                })
                .catch((error) => console.error("Error listening to messages: ", error));
        };

        initFCM();
        setupMessageListener();
    }, []);

    return { notification };
};
