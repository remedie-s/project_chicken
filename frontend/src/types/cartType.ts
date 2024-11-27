
import type {ProductsDto} from "@/types/productType";

export type CartType = {
    id: number,
    quantity: number,
    products: ProductsDto
}