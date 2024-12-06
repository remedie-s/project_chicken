import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/router"; // Next.js 라우터 사용
import { productData } from "@/api/datatype";
import { productDetail } from "@/api/api";

const ProductDetailPage = (): JSX.Element => {
    const [inputId, setInputId] = useState<string>(""); // 사용자 입력 ID 상태
    const [product, setProduct] = useState<productData | null>(null); // 제품 데이터 상태
    const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태
    const router = useRouter();

    // 쿼리에서 ID를 읽어 자동 검색
    useEffect(() => {
        const queryId = router.query.id as string | undefined;
        if (queryId) {
            setInputId(queryId);
            handleSearch(queryId); // 검색 실행
        }
    }, [router.query.id]);

    // 입력값 또는 전달받은 ID로 제품 검색
    const handleSearch = async (idToSearch: string = inputId) => {
        if (!idToSearch.trim()) {
            setError("Please enter a valid Product ID.");
            return;
        }

        setLoading(true);
        setError(null);
        setProduct(null);

        try {
            const fetchedProduct = await productDetail(Number(idToSearch)); // API 호출
            setProduct(fetchedProduct);
        } catch (err: any) {
            setError(err.message || "Failed to fetch product details.");
        } finally {
            setLoading(false);
        }
    };

    // 수정 페이지로 이동
    const handleEdit = () => {
        if (product?.id) {
            router.push(`/products/edit/${product.id}`);
        }
    };

    // 홈으로 이동
    const handleGoHome = () => {
        router.push("/");
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* 입력 필드와 버튼 */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <TextField
                    label="Product ID"
                    variant="outlined"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)} // 입력값 변경
                    fullWidth
                />
                <Button variant="contained" onClick={() => handleSearch()} disabled={loading}>
                    Search
                </Button>
            </Box>

            {/* 로딩 중 표시 */}
            {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
                    <CircularProgress />
                </Box>
            )}

            {/* 에러 메시지 표시 */}
            {error && (
                <Typography color="error" variant="h6" align="center" sx={{ mt: 3 }}>
                    {error}
                </Typography>
            )}

            {/* 제품 정보 표시 */}
            {product && (
                <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Typography variant="h4" gutterBottom>
                            {product.name}
                        </Typography>
                        <Button variant="outlined" color="primary" onClick={handleEdit}>
                            Edit
                        </Button>
                    </Box>
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
                            sx={{ width: "100%", maxHeight: 300, mt: 2 }}
                        />
                    )}
                </Box>
            )}

            {/* 홈으로 가기 버튼 */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button variant="contained" color="secondary" onClick={handleGoHome}>
                    Go to Home
                </Button>
            </Box>
        </Box>
    );
};

export default ProductDetailPage;
