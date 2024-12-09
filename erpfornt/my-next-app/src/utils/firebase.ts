import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBvdGEQeCZrTSboWWn7hJ1JdUBJ7aHkVP8",
    authDomain: "project-chicken-4c.firebaseapp.com",
    projectId: "project-chicken-4c",
    storageBucket: "project-chicken-4c.firebasestorage.app",
    messagingSenderId: "672951577203",
    appId: "1:672951577203:web:41b11a915050e129bad806",
};
// Firebase 초기화
const firebaseApp = initializeApp(firebaseConfig);

// Firebase Messaging 객체 가져오기
const messaging = getMessaging(firebaseApp);

/**
 * FCM 토큰 요청 및 반환
 * 브라우저에서 알림 권한 요청 후 FCM 토큰을 반환합니다.
 */
export const requestPermission = async (): Promise<string | null> => {
    console.log("Requesting notification permission...");
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("Notification permission granted.");
            const token = await getToken(messaging, {
                vapidKey: "BJtL49O7f2Hem0bq4Ezdg5cQbVF7nc4cnglqi0TuqD6zFrPJnb6hqbV1JY9__iSldh0B7omBsI8phnl2eGIvTFo",
            });
            if (token) {
                console.log("FCM Token:", token);
                return token;
            } else {
                console.error("No registration token available. Request permission to generate one.");
                return null;
            }
        } else {
            console.error("Notification permission denied.");
            return null;
        }
    } catch (error) {
        console.error("Error requesting notification permission:", error);
        return null;
    }
};

/**
 * FCM 포그라운드 메시지 수신 리스너
 * 브라우저가 포그라운드 상태일 때 수신된 메시지를 처리합니다.
 */
export const onMessageListener = (): Promise<any> =>
    new Promise((resolve, reject) => {
        // 두 번째 인자만 사용하여 콜백 함수를 처리합니다.
        onMessage(messaging, (payload) => {
            resolve(payload);
        });

        // reject는 onMessage 내부에서 자동으로 처리되므로, 따로 넣지 않아도 됩니다.
        // 만약 메시지 수신 오류가 발생할 경우, onMessage 내부에서 자동으로 처리됩니다.
    });


export default firebaseApp;