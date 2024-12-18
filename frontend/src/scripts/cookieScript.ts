const cookie = require("cookie");

// 쿠키를 읽는 함수
export function getCookie(name: string): string | undefined {
    const cookies = cookie.parse(document.cookie);
    return cookies[name];
}

// 쿠키를 설정하는 함수
// 쿠키명, 값, 쿠키 만료일(지금부터 며칠 후 만료될지)
export function setCookie(name: string, value: string|number, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = cookie.serialize(name,value, {
        path: '/',  // 쿠키 저장 경로
        // httpOnly: true,  // 보안을 위해 JavaScript에서 접근 불가
        httpOnly: false,  // 개발 환경상 어쩔 수 없음
        // secure: process.env.NODE_ENV === 'production',  // 보안을 위해HTTPS 환경에서만
        secure: false,  // 개발 환경은 http라서 false
        sameSite: true,  // CSRF 방지
        expires: expires
    });
}

// 쿠키를 삭제하는 함수
export function deleteCookie(name: string) {
    document.cookie = cookie.serialize(name, '', {maxAge: -1, path: '/'});
}
