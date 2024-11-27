import {string} from "prop-types";
import {Dayjs} from "dayjs";

export type ProductsDto = {
    id: number,
    name: string,
    description: string,
    price: number,
    createdAt: Dayjs,
    imageUrl: string,
    stock: number,
    sellCount: number,
    category: string,
    mainItemNumber: number
};
