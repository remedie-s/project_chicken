// 쿠키에서 토큰과 사용자 정보 삭제

import {deleteCookie} from "@/scripts/cookieScript";

const cookie = require("cookie");

export default function authLogout() {
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("userName");
    deleteCookie("userGrade");
// 로그아웃시 홈 이동, 새로고침
    alert("로그인 정보 오류로 홈으로 돌아갑니다.")
    window.location.href = "/"
}