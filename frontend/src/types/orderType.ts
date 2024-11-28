import {string} from "prop-types";
import {Dayjs} from "dayjs";
import type {ProductsDto} from "./productType";

export type OrderDto = {
    id: number,
    quantity: number,
    price: number,
    discount: number,
    payPrice: number,
    createdAt: Dayjs,
    available: boolean,
    invoice: number,
    address: string,
    products: ProductsDto
};