
export function removeSpecialCharacters(input: string): string {
    // 공백과 알파벳, 숫자, 한글 외에 모든 특수문자만 제거
    return input.replace(/[^\w\s가-힣]/g, " ");
}
