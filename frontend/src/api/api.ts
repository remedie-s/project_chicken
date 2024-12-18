import axios from "axios";
import { NotificationRequest, TokenData } from "@/types/fcmType";

// const API_URL = 'http://localhost:8080/api'; // Spring Boot ERP 페이지
// const API_URL =  'http://192.168.0.11:8080/api'; // Spring Boot ERP 페이지 - 차후 서버페이지로 변경
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// 쿠키에서 값을 추출하는 함수
const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
};

const api = axios.create({
    baseURL: API_URL, // Spring Boot 서버의 URL
});

// 요청 인터셉터 추가
api.interceptors.request.use((config) => {
    const token = getCookie('accessToken'); // 쿠키에서 accessToken 가져오기
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 응답 인터셉터 추가
api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        // 401 또는 403 오류 발생 시 리프레시 토큰으로 새로운 accessToken을 발급
        if ((error.response.status === 401) && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = getCookie('refreshToken'); // 쿠키에서 refreshToken 가져오기
            if (!refreshToken) {
                window.location.href = "/user/login";
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken }, {
                    headers: { 'Content-Type': 'application/json' }
                });
                const { accessToken } = response.data;

                document.cookie = `accessToken=${accessToken}; path=/`; // 새로운 accessToken 쿠키에 저장
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                window.location.href = "/user/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


// FCM 관련 메시지
// FCM 토큰 저장
export const storeToken = async (tokenData: TokenData) => {
    try {
        const response = await api.put(`${API_URL}/fcm/storeToken`, tokenData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 수정된 파트너 데이터 반환
    } catch (error: any) {
        console.error("Error storing FCM token:", error);
        throw error.response.data; // 실패 시 에러 반환
    }
};

// FCM 토큰 저장 여부 확인
export const getFCMIsStore = async () => {
    try {
        const response = await api.get(`${API_URL}/fcm/isStore`);
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};

// FCM 알림 전송
export const sendNotification = async (notificationRequest: NotificationRequest) => {
    try {
        const response = await api.put(`${API_URL}/fcm/sendNotification`, notificationRequest, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // 성공 시 수정된 파트너 데이터 반환
    } catch (error: any) {
        console.error("Error sending FCM notification:", error);
        throw error.response.data; // 실패 시 에러 반환
    }
};
