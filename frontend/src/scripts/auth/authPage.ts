const cookie = require("cookie");

// 사용자 인증 확인 함수
export default function authPage () {
    if (typeof window !== 'undefined') { // 브라우저 환경 확인
        const cookies = document.cookie ? cookie.parse(document.cookie) : {};
        const token = cookies.accessToken;

        if (!token) {
            alert("로그인이 필요한 페이지입니다");
            window.location.href = "/user/login" ; // 이전 페이지로 리디렉트
        }
    }
};
