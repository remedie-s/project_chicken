const cookie = require("cookie");

// 쿠키를 읽는 함수
export function getCookie(name: string): string | undefined {
    const cookies = cookie.parse(document.cookie);
    return cookies[name];
}

// 쿠키를 설정하는 함수
export function setCookie(name: string, value: string, days: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// 쿠키를 삭제하는 함수
export function deleteCookie(name: string) {
    document.cookie = cookie.serialize(name, '', {maxAge: -1, path: '/'});
}
