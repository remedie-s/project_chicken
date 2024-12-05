import {string} from "prop-types";
import {Dayjs} from "dayjs";
import type {ProductsDto} from "./productType";

export type OrderDto = {
    id: number,
    quantity: number,
    price: number,
    discount: number,
    payPrice: number,
    createdAt: Date,
    available: boolean,
    invoice: number,
    address: string,
    // productsDto: ProductsDto
    products: ProductsDto
};

export type OrderRequestType = {
    productsDto: ProductsDto,
    quantity: number
}