import {Box} from "@mui/material";
import Layout from "./layout"
import {ProductsDto} from "@/types/productType";
import dayjs from "dayjs";
import ProductList from "@/components/product/ProductList";


export default function index(){

    const dummyProducts: ProductsDto[] = [
        { id: 1, name: '상품 1', price: 1000, createdAt: new Date('2024-01-08'),
            imageUrl: "https://cdn.pixabay.com/photo/2024/03/12/15/42/greylag-goose-8629040_640.jpg",
        sellCount: 1},
        { id: 2, name: '상품 2', price: 2000, createdAt: new Date('2024-01-07'),
            imageUrl: "https://cdn.pixabay.com/photo/2024/03/12/15/42/greylag-goose-8629040_640.jpg" ,
            sellCount: 4 },
        { id: 3, name: '상품 3', price: 3000, createdAt: new Date('2024-01-06'),
            imageUrl: "https://cdn.pixabay.com/photo/2024/03/12/15/42/greylag-goose-8629040_640.jpg" ,
            sellCount: 5 },
        { id: 4, name: '상품 4', price: 4000, createdAt: new Date('2024-01-05'),
            imageUrl: "https://cdn.pixabay.com/photo/2024/03/12/15/42/greylag-goose-8629040_640.jpg" ,
            sellCount: 6 },
        { id: 5, name: '상품 5', price: 5000, createdAt: new Date('2024-01-04'),
            imageUrl: "https://cdn.pixabay.com/photo/2024/03/12/15/42/greylag-goose-8629040_640.jpg" ,
            sellCount: 7 },
        { id: 6, name: '상품 6', price: 6000, createdAt: new Date('2024-01-03'),
            imageUrl: "https://cdn.pixabay.com/photo/2024/03/12/15/42/greylag-goose-8629040_640.jpg" ,
            sellCount: 8 },
        { id: 7, name: '상품 7', price: 7000, createdAt: new Date("2024-01-02"),
            imageUrl: "https://cdn.pixabay.com/photo/2024/03/12/15/42/greylag-goose-8629040_640.jpg" ,
            sellCount: 9 },
        { id: 8, name: '상품 8', price: 8000, createdAt: new Date('2024-01-01'),
            imageUrl: 'https://cdn.pixabay.com/photo/2024/03/12/15/42/greylag-goose-8629040_640.jpg' ,
            sellCount: 10},
    ];


    return (
      <Box sx={{ height: 500}}>
      <ProductList products={dummyProducts}/>
      </Box>
          )
}