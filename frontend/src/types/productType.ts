import {string} from "prop-types";
import {Dayjs} from "dayjs";
//
// export type ProductsDto = {
//     id: number,
//     name: string,
//     description: string,
//     price: number,
//     createdAt: Date,
//     imageUrl: string,
//     stock: number,
//     sellCount: number,
//     category: string,
//     mainItemNumber: number
// };

export type ProductsDto = {
    id: number,
    name: string,
    price: number,
    createdAt: Date,
    imageUrl: string,
    sellCount: number
};
