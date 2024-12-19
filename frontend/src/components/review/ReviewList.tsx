import {Box, Paper, Typography, Rating, Button, TextField} from "@mui/material";
import {ProductReviewsDto} from "@/types/productReviewType";
import dayjs from "dayjs";
import React, {useEffect, useState} from "react";
import axios from "axios";
import ReviewCreate from "@/components/review/ReviewCreate";
import authApi from "@/scripts/auth/authApi";
import {UsersDto} from "@/types/userType";
import StarIcon from "@mui/icons-material/Star";

const cookie = require("cookie");

type reviewListType = {
    productId: string,
    reviewCreateAuth: boolean,
    setAverageRating: React.Dispatch<React.SetStateAction<number>>
}

export default function ReviewList({productId, reviewCreateAuth, setAverageRating}: reviewListType) {
    const [productReviews, setProductReviews] = useState<ProductReviewsDto[] | null>(null);
    // 각 리뷰 작성자인지 확인용
    const [currentUser, setCurrentUser] = useState<number | null>(null);

    function getCookie(name: string) {
        const cookies = cookie.parse(document.cookie);
        return cookies[name];
    }

    useEffect(() => {
        const fetchDataUser = async () => {
            const accessToken = getCookie("accessToken");
            if (!accessToken) {
                return;
            }
            const res = await authApi.get<UsersDto>("/users/detail");
            setCurrentUser(res.data.id)
        }
        const fetchData = async () => {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api'; // 기본값 설정
            const res = await axios.get<ProductReviewsDto[] | null>(`${apiUrl}/product/reviews/list/${productId}`);
            if (res.status !== 200) {
                alert("상품 리뷰를 불러오는데 문제가 발생했습니다.");
            } else {
                setProductReviews(res.data);
            }
        }
        fetchDataUser();
        fetchData();
    }, []);


    useEffect(()=>{
        // 리뷰 평균 점수
        const calculateAverageRating = (reviews: ProductReviewsDto[]) => {
            const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
            const numberOfReviews = reviews.length;
            // 소수점 한 자리로 반올림 후 숫자로 변환
            const average = parseFloat((totalRating / numberOfReviews).toFixed(1));
            setAverageRating(average);
        };
        if(productReviews && productReviews.length>0) {
            calculateAverageRating(productReviews);
        } else {
            setAverageRating(0);
        }
    },[productReviews])

    // 각 리뷰 생성, 관리하는 컴포넌트
    const ReviewOne = ({productReview}: { productReview: ProductReviewsDto }) => {
        const [reviewModify, setReviewModify] = useState(false);
        const [newContent, setNewContent] = useState(productReview.content);
        const [newRating, setNewRating] = useState(productReview.rating);
        const [newRatingHover, setNewRatingHover] = useState(-1);
        let userCheck = () => productReview.usersDto.id === currentUser;

        const reviewDeleteHandler = async () => {
            if (!confirm("정말 삭제하시겠습니까?")) {
                return;
            }
            try {
                const res = await authApi.post(`/product/reviews/${productId}/delete/${productReview.id}`);
                if (res.status !== 200) {
                    alert("리뷰 삭제에 실패했습니다.");
                    return;
                }
                setProductReviews(res.data); // 삭제된 리뷰 목록을 업데이트
            } catch (error) {
                console.error("리뷰 삭제 중 오류 발생:", error);
                alert("리뷰 삭제 중 오류가 발생했습니다.");
            }
        };

        const handleReviewContentChange = (newContent: string) => {
            setNewContent(newContent);
        };

        const saveReviewHandler = async () => {
            const data = {
                rating: newRating,
                content: newContent
            }
            try {
                const res = await authApi.post(`/product/reviews/${productId}/modify/${productReview.id}`, data);
                if (res.status !== 200) {
                    alert("리뷰 수정에 실패했습니다.");
                    return;
                }
                setProductReviews(res.data); // 수정된 리뷰 목록을 업데이트
                setReviewModify(false); // 수정 상태 종료
            } catch (error) {
                console.error("리뷰 수정 중 오류 발생:", error);
                alert("리뷰 수정 중 오류가 발생했습니다.");
            }
        };

        const cancelEditHandler = () => {
            setReviewModify(false);
            setNewContent(productReview.content); // 수정 취소 시 원래 내용으로 복원
            setNewRating(productReview.rating);
        };
        // 리뷰용 이름 익명 처리
        const maskName = (name: string) => {
            if (name.length > 1) {
                return name[0] + '**'; // 첫 글자만 남기고 '**' 추가
            }
            return name; // 이름이 한 글자면 그대로 반환
        };


        return (
            <Box sx={{borderTop: '1px solid #ccc', paddingY: 1}}>
                {reviewModify ?
                    <Rating
                        value={newRating}
                        precision={0.5}
                        onChange={(e, newValue) => {
                            setNewRating(newValue !== null ? newValue : newRating);
                        }}
                        onChangeActive={(e, newHover) => {
                            setNewRatingHover(newHover !== null ? newHover : newRatingHover);
                        }}
                        emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                    />
                    :
                    <Rating
                        value={productReview.rating}
                        precision={0.5}
                        readOnly
                    />}
                <Typography>
                    {maskName(productReview.usersDto.name)} | {dayjs(productReview.createdAt).format('YYYY-MM-DD')}
                </Typography>
                {reviewModify ? (
                    <TextField
                        value={newContent}
                        onChange={(e) => handleReviewContentChange(e.target.value)}
                    />
                ) : (
                    <Typography>
                        {productReview.content}
                    </Typography>
                )}
                <Box>
                    {userCheck() ? (
                        <>
                            {reviewModify ? (
                                <>
                                    <Button onClick={saveReviewHandler}>저장</Button>
                                    <Button onClick={cancelEditHandler}>수정 취소</Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={() => setReviewModify(true)}
                                            sx={{backgroundColor: "#000000", color: "#FFFFFF", marginRight: 2}}
                                            size="small">수정</Button>
                                    <Button onClick={reviewDeleteHandler}
                                            sx={{backgroundColor: "#FFDF00", color: "#000000"}}
                                            size="small">삭제</Button>
                                </>
                            )}
                        </>
                    ) : null}
                </Box>
            </Box>
        )
    }


    return (
        <Box>
            {reviewCreateAuth ? <ReviewCreate productId={productId} setProductReviews={setProductReviews}/> : <></>}
            {productReviews && productReviews.length !== 0 ?
                (productReviews.map(
                    (productReview, index) =>
                        (<ReviewOne key={index} productReview={productReview}/>)))
                :
                <Box>
                    아직 리뷰가 없습니다.
                </Box>
            }
        </Box>
    )
}