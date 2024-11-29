import {Dayjs} from "dayjs";

export type UsersDto = {
    id: number,
    name: string,
    email: string,
    password: string,
    createdAt: Date,
    gender: string,
    address: string,
    birthDate: Date,
    userGrade: number,              // 없음, 브론즈, 실버, 골드, 플래티넘
    totalPurchaseCount: number,     // 총 주문 수량
    totalPurchasePrice: number,     // 총 주문 금액
    passwordQuestion: string,
    passwordAnswer: string
}

export type TokenResponseDto = {
    message: string,
    accessToken: string,
    refreshToken: string,
    email: string,
    name: string
}