# 기본 구성도
- backend : 쇼핑몰 백엔드 / 스프링부트
- frontend : 쇼핑몰 프론트엔드 / 스프링 부트
- erpfront/my-next-app : ERP 프론트엔드 / 넥스트 js
- erp : ERP 프론트 엔드 / 넥스트 js

# PPT 
https://docs.google.com/presentation/d/1q17vbbbgPtdraI-nsZQg3qHRiGko01x3AGXdQX_h_h0/edit?usp=sharing

# 기술 스택 
Spring Boot, React, TypeScript, NextJs, MySQL, Kafka, Firebase Cloud Messaging(FCM), WebSocket, Docker, GitHub, JWT, Spring Security

# 실행 방법
아래 기본 설정 후 도커 데스크탑 실행후 각 프론트 폴더에서 npm install 후 npm run build 후에 루트 폴더에서 docker compose up -d 필요

# 도커 가동되는 서비스 목록
zookeeper, kafka1,2,3 , elasticSearch, kibana, mysql, backend, frontend, erpfront, erp


# 기본 설정 파일
도커 컴포즈 파일 주소 변경
.env 파일 주소 변경
스프링부트 환경 설정 파일 변경

# 기본 파이어베이스 파일 설정

## utils 아래에 firebase.ts 파일 본인 키 넣고 생성
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage, Messaging } from "firebase/messaging";

// Firebase 설정
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
};

// Firebase 초기화 및 Firebase Messaging 객체 가져오기
let firebaseApp;
let messaging: Messaging | undefined;

if (typeof window !== "undefined") {  // 클라이언트 사이드에서만 실행
    // Firebase 초기화
    firebaseApp = initializeApp(firebaseConfig);

    // Firebase Messaging 객체 가져오기
    messaging = getMessaging(firebaseApp);
}

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
            if (messaging) {
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
                console.error("Firebase Messaging is not initialized.");
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
        if (messaging) {
            onMessage(messaging, (payload) => {
                resolve(payload);
            });
        } else {
            reject("Firebase Messaging is not initialized.");
        }
    });

export default firebaseApp;

## public 아래에 firebase-messaging-sw.js 본인 키 넣고 생성

importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const showNotification = (title, options) => {
    self.registration.showNotification(title, options);
};

messaging.onBackgroundMessage((payload) => {
    const { title, body, icon } = payload.notification;
    showNotification(title, { body, icon });
});

self.addEventListener("push", (event) => {
    if (!event.data.json()) return;
    const { title, body, icon } = event.data.json().notification;
    showNotification(title, { body, icon });
});

## 스프링 부트 resources 아래에 serviceAccountKey.json  본인 키 넣고 생성
{
  "type": "service_account",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "",
  "universe_domain": "googleapis.com"
}


