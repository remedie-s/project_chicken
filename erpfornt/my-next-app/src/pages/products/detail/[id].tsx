import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useRouter } from "next/router"; // Next.js 라우터 사용
import { productData } from "@/api/datatype";
import { productDetail, productReview, productReviewDelete } from "@/api/api"; // productReviewDelete 추가
import Grid from "@mui/material/Grid"; // Grid 추가

const ProductDetailPage = (): JSX.Element => {
    const [inputId, setInputId] = useState<string>(""); // 사용자 입력 ID 상태
    const [product, setProduct] = useState<productData | null>(null); // 제품 데이터 상태
    const [loading, setLoading] = useState<boolean>(false); // 로딩 상태
    const [error, setError] = useState<string | null>(null); // 에러 상태
    const [reviews, setReviews] = useState<any[]>([]); // 리뷰 리스트 상태
    const router = useRouter();

    // 쿼리에서 ID를 읽어 자동 검색
    useEffect(() => {
        const queryId = router.query.id as string | undefined;
        if (queryId) {
            setInputId(queryId);
            handleSearch(queryId); // 제품 검색
            fetchReviews(queryId); // 리뷰 검색
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
            const fetchedProduct = await productDetail(Number(idToSearch)); // 제품 정보 요청
            setProduct(fetchedProduct);
            const fetchedReviews = await productReview(Number(idToSearch)); // 리뷰 데이터 요청
            setReviews(fetchedReviews);
        } catch (err: any) {
            setError(err.message || "Failed to fetch product details.");
        } finally {
            setLoading(false);
        }
    };

    // 리뷰 데이터 가져오기
    const fetchReviews = async (productId: string) => {
        try {
            const fetchedReviews = await productReview(Number(productId)); // 리뷰 데이터 요청
            setReviews(fetchedReviews);
        } catch (err: any) {
            setError("Failed to fetch reviews.");
        }
    };
    // 홈으로 이동
    const handleGoHome = () => {
        router.push("/");
    };

    // 리뷰 삭제 처리
    const handleDeleteReview = async (reviewId: number) => {
        try {
            await productReviewDelete(reviewId); // 리뷰 삭제 API 호출
            setReviews(reviews.filter(review => review.id !== reviewId)); // 리뷰 목록에서 삭제된 리뷰 제거
        } catch (err: any) {
            setError("Failed to delete review.");
        }
    };

    // 수정 페이지로 이동
    const handleEdit = () => {
        if (product?.id) {
            router.push(`/products/edit/${product.id}`);
        }
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

            {/* 리뷰 리스트 표시 */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Reviews
                </Typography>

                {/* Grid로 리뷰 항목 정렬 */}
                <Grid container spacing={3}>
                    {reviews.length === 0 ? (
                        <Typography variant="body1" color="textSecondary" sx={{ gridColumn: "span 12" }}>
                            No reviews available.
                        </Typography>
                    ) : (
                        reviews.map((review, index) => (
                            <Grid item xs={12} md={6} lg={4} key={index}>
                                <Box sx={{ mb: 3, borderBottom: "1px solid #ddd", pb: 2 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        {review.users.name} - {review.createdAt}
                                    </Typography>
                                    <Typography variant="body1">{review.content}</Typography>
                                    <Typography variant="body2" color="primary">
                                        Rating: {review.rating} ★
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() => handleDeleteReview(review.id)}
                                        sx={{ mt: 1 }}
                                    >
                                        Delete
                                    </Button>
                                </Box>
                            </Grid>
                        ))
                    )}
                </Grid>
            </Box>
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
