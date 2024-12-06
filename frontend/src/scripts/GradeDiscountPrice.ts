
const cookie = require("cookie");

// 가격에 할인 적용
const gradeDiscountPrice = (price: number) => {

    let discountedPrice = price;
    // 클라이언트 사이드에서 쿠키 읽기
    // cookie.parse로 쿠키 읽기
    const cookies = cookie.parse(document.cookie);
    // 쿠키에서 userGrade 값을 추출
    if(cookies.userGrade) {
        const userGrade = Number(cookies.userGrade);

        if (userGrade === 1) discountedPrice = price * 0.97; // 3% 할인
        else if (userGrade === 2) discountedPrice = price * 0.95; // 5% 할인
        else if (userGrade === 3) discountedPrice = price * 0.90; // 10% 할인
        // 해당 없으면 할인 없음, 소수점 자리 내림
    }
    return Math.floor(discountedPrice);
};

export default gradeDiscountPrice;