import axios from "axios";
import authErrorLogout from "@/scripts/auth/authErrorLogout";
import {useRouter} from "next/navigation";
const cookie = require("cookie");

// 쿠키에서 JWT 토큰을 가져오는 함수
function getCookie(name: string): string | undefined {
    const cookies = cookie.parse(document.cookie);
    return cookies[name];
}

// 새로운 액세스 토큰 발급 함수
async function refreshAccessToken() {
    const refreshToken = getCookie("refreshToken");
    if (!refreshToken) {
        throw new Error("리프레시 토큰이 없습니다.");
    }

    try {
        const response = await axios.post("http://localhost:8080/api/auth/refresh", {}, {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
                'Content-Type': 'application/json',
            },
            withCredentials: true,
        });

        const newAccessToken = response.data.accessToken;
        document.cookie = cookie.serialize("accessToken", newAccessToken, { path: "/" });
        return newAccessToken;
    } catch (error) {
        throw new Error("액세스 토큰 갱신 실패");
    }
}

// Axios 인스턴스 생성
const authApi = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터를 사용하여 헤더에 JWT 토큰 포함
authApi.interceptors.request.use((config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 응답 인터셉터를 사용하여 401 오류 처리
authApi.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const newAccessToken = await refreshAccessToken();
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return authApi(originalRequest);
        } catch (refreshError) {
            console.error("재인증 실패:", refreshError);
            // 리프레시 토큰도 실패하면 로그아웃
            authErrorLogout();
        }
    } else if (error.response && error.response.status === 403) {
        console.error("접근 권한 없음:", error.response.data);
        alert("접근 권한이 없습니다.")
    }
    return Promise.reject(error);
});

export default authApi;
