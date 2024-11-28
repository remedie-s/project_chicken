import axios from "axios";
const cookie = require("cookie");

// 쿠키에서 JWT 토큰을 가져오는 함수
function getCookie(name: string): string | undefined {
    const cookies = cookie.parse(document.cookie);
    return cookies[name];
}

// 대표 함수
// Axios 인스턴스 생성
const apiClient = axios.create({
    // API의 기본 URL
    baseURL: 'http://localhost:8080/api',
    withCredentials: true, // 쿠키 포함
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터를 사용하여 헤더에 JWT 토큰 포함
apiClient.interceptors.request.use((config) => {
    // 쿠키에서 JWT 토큰을 가져옵니다.
    const accessToken = getCookie("accessToken")
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default apiClient;
