import axios from "axios";
import {NotificationRequest, TokenData} from "@/types/fcmType";
const API_URL =  'http://localhost:8080/api'; // spring boot ERP 페이지
// const API_URL =  'http://192.168.0.8:8080/api'; // spring boot ERP 페이지- 차후 서버페이지로 변경
const api = axios.create({
    baseURL:API_URL, // Spring Boot 서버의 URL
})
// 요청 인터셉터 추가
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken'); // 세션 스토리지에서 토큰 가져오기
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// 요청 인터셉터 추가
api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;

        if ((error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = sessionStorage.getItem('refreshToken');
            if (!refreshToken) {
                window.location.href = "/user/login";
                return Promise.reject(error);
            }

            try {
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                const { accessToken } = response.data;

                sessionStorage.setItem('accessToken', accessToken);
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
export const storeToken = async (tokenData:TokenData ) => {
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
        const response = await api.get('${API_URL}/fcm/isStore');
        return response.data; // 성공시 응답 데이터 반환
    } catch (error: any) {
        throw error.response.data; // 실패시 에러 반환
    }
};

// FCM 알림 전송
export const sendNotification = async (notificationRequest:NotificationRequest ) => {
    try {
        const response = await api.put(`${API_URL}/fcm/sendNotification`, notificationRequest, {
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