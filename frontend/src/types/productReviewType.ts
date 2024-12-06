import type {ProductsDto} from "@/types/productType";
import type {UsersDto} from "@/types/userType";

export type ProductReviewsDto = {
    id: number,
    content: string,
    // 별점
    rating: number,
    // 리뷰 작성일
    createdAt: Date,
    usersDto: UsersDto,
    productsDto: ProductsDto
}