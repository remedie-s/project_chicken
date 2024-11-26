import {Dayjs} from "dayjs";

export type userDto = {
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