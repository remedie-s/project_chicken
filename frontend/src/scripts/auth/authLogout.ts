// 쿠키에서 토큰과 사용자 정보 삭제

const cookie = require("cookie");

export default function authLogout() {
    document.cookie = cookie.serialize('accessToken', '', {maxAge: -1, path: '/'});
    document.cookie = cookie.serialize('refreshToken', '', {maxAge: -1, path: '/'});
    document.cookie = cookie.serialize('userName', '', {maxAge: -1, path: '/'});
    document.cookie = cookie.serialize('userGrade', '', {maxAge: -1, path: '/'});
// 로그아웃시 홈 이동, 새로고침
    alert("로그인 정보 오류로 홈으로 돌아갑니다.")
    window.location.href = "/"
}