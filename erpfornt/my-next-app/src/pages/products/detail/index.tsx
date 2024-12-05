import * as React from 'react';
import { GetServerSideProps } from 'next'; // getServerSideProps import
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { productData } from "@/api/datatype";
import { productDetail } from "@/api/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

interface ProductDetailPageProps {
    product: productData | null;
    error: string | null;
    productId: string;
}

const ProductDetailPage = ({ product, error, productId }: ProductDetailPageProps): JSX.Element => {
    const [inputId, setInputId] = React.useState<string>(productId); // 사용자 입력 ID 상태

    // 입력값을 통해 제품 ID를 검색
    const handleSearch = () => {
        if (inputId.trim()) {
            window.location.href = `/product/${inputId}`; // 입력한 ID로 경로 변경
        }
    };

    // 로딩 중 표시
    if (!product && !error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // 에러 발생 시 표시
    if (error) {
        return (
            <Typography color="error" variant="h6" align="center">
                {error}
            </Typography>
        );
    }

    // 제품이 없을 경우
    if (!product) {
        return (
            <Typography variant="h6" align="center">
                Product not found.
            </Typography>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                {product.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {product.description}
            </Typography>
            <Typography variant="h6">Price: {product.price} USD</Typography>
            <Typography variant="body2">Stock: {product.stock}</Typography>
            <Typography variant="body2">Category: {product.category}</Typography>
            <Typography variant="body2">Brand: {product.brand}</Typography>
            {product.imageUrl && (
                <Box
                    component="img"
                    src={product.imageUrl}
                    alt={product.name}
                    sx={{ width: '100%', maxHeight: 300, mt: 2 }}
                />
            )}

            {/* 입력 필드와 버튼 */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 3 }}>
                <TextField
                    label="Product ID"
                    variant="outlined"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)} // 입력값 변경
                />
                <Button variant="contained" onClick={handleSearch}>
                    Search
                </Button>
            </Box>
        </Box>
    );
};

// getServerSideProps로 데이터 가져오기
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { productId } = params as { productId: string };
    let product: productData | null = null;
    let error = null;

    try {
        product = await productDetail(Number(productId)); // API 호출
    } catch (err:any) {
        error = err.message || 'Failed to fetch product details.';
    }

    return {
        props: {
            product,
            error,
            productId, // URL에서 받은 productId를 props로 전달
        },
    };
};

export default ProductDetailPage;
