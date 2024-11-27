import {Dayjs} from "dayjs";

export type UsersDto = {
    id: number,
    name: string,
    email: string
    password: string
    createdAt: Dayjs
    gender: string,
    address: string,
    birthDate: Dayjs,
    userGrade: number,
    totalPurchaseCount: number,
    totalPurchasePrice: number,
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