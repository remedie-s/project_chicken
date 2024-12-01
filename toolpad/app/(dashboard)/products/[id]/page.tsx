'use client';
import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { productData } from "@/app/types/datatype";
import { productDetail } from "@/app/api/api";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

/**
 *     id?: number|null;
 *     name: string;
 *     description: string;
 *     price: number;
 *     createdAt: string; // LocalDateTime은 ISO 8601 형식의 문자열로 변환할 수 있습니다.
 *     imageUrl: string;
 *     stock: number;
 *     sellCount: number;
 *     category: string;
 *     mainItemNumber: number;
 *     event: number;
 *     brand: string;
 *     cost: number;
 *     partnerId: number; // Partner는 별도의 타입으로 정의해야 합니다.
 *
 * @constructor
 */

export default function ProductDetailPage(): JSX.Element {
    const { productId } = useParams(); // Next.js의 useParams를 사용하여 productId 가져오기
    const router = useRouter(); // 라우터 객체 생성
    const [inputId, setInputId] = React.useState<string>(''); // 사용자 입력 ID 상태
    const [product, setProduct] = React.useState<productData | null>(null);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [error, setError] = React.useState<string | null>(null);

    // 데이터 가져오기 함수
    const fetchProduct = async (id: number) => {
        try {
            setLoading(true);
            const data = await productDetail(id); // API 호출
            setProduct(data);
        } catch (err: any) {
            setError(err || "Failed to fetch product details.");
        } finally {
            setLoading(false);
        }
    };

    // URL의 `productId`로 데이터 불러오기
    React.useEffect(() => {
        if (productId) {
            fetchProduct(Number(productId)); // `productId`가 있을 때만 데이터 호출
        }
    }, [productId]);

    // 입력값을 통해 제품 ID를 검색
    const handleSearch = () => {
        if (inputId.trim()) {
            router.push(`/product/${inputId}`); // 입력한 ID로 경로 변경
        }
    };

    // 로딩 중 표시
    if (loading) {
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
}
