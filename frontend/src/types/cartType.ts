
import type {ProductsDto} from "@/types/productType";

export type CartsDto = {
    id: number,
    quantity: number,
    productsDto: ProductsDto
}