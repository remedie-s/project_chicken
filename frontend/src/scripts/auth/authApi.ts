import axios from 'axios';
const cookie = require('cookie');

// Axios 인스턴스 생성
const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
});

// 요청 인터셉터 추가
apiClient.interceptors.request.use(
    (config) => {
        const cookies = document.cookie ? cookie.parse(document.cookie) : {};
        const token = cookies.accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 공통 API 요청 함수
export const authApi = async (path: string, method = "POST", data = null) => {
    try {
        const response = await apiClient({
            url: path,
            method: method,
            data: data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export default apiClient;
