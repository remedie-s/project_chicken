// 쿠키에서 토큰과 사용자 정보 삭제

const cookie = require("cookie");

export default function authErrorLogout() {
    console.log("authErrorLogout 함수 시작됨");
    document.cookie = cookie.serialize('accessToken', '', {maxAge: -1, path: '/'});
    document.cookie = cookie.serialize('refreshToken', '', {maxAge: -1, path: '/'});
    document.cookie = cookie.serialize('userName', '', {maxAge: -1, path: '/'});
// 로그아웃시 홈 이동, 새로고침
    alert("이용자 정보 오류로 로그아웃되었습니다.")
    window.location.href = "/"
}