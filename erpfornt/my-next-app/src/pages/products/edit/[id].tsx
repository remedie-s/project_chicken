import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {modifyProductData, productData} from '@/api/datatype';
import { productDetail, productModify } from '@/api/api';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const ProductEditPage = () => {
    const router = useRouter();
    const { id } = router.query; // URL에서 ID 가져오기
    const [product, setProduct] = useState<modifyProductData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    setLoading(true);
                    const fetchedProduct = await productDetail(Number(id));
                    setProduct(fetchedProduct);
                } catch (err: any) {
                    setError(err.message || "Failed to load product details.");
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id]);

    const handleSave = async () => {
        if (product) {
            try {
                setLoading(true);
                await productModify(product); // 수정 API 호출
                router.push(`/`); // 메인 페이지로 이동
            } catch (err: any) {
                setError(err.message || "Failed to update product.");
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Loading...</Typography>
            </Box>
        );
    }

    if (!product) {
        return <Typography>Error: {error || "Product not found"}</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Edit Product</Typography>
            <TextField
                label="Name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Description"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Price"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
                fullWidth
                margin="normal"
            />
            {/* 추가 필드들 */}
            <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
                Save
            </Button>
        </Box>
    );
};

export default ProductEditPage;
