"use client"
import {Box, Button, Rating, TextField, Typography} from "@mui/material";
import {SyntheticEvent, useState} from "react";
import authApi from "@/scripts/auth/authApi";
import StarIcon from '@mui/icons-material/Star';
import {useRouter} from "next/navigation";
import {ProductReviewsDto} from "@/types/productReviewType";

type reviewCreateType = {
    productId: string,
    setProductReviews: React.Dispatch<React.SetStateAction<ProductReviewsDto[] | null | undefined>>
}

export default function ReviewCreate({productId, setProductReviews}: reviewCreateType) {
    const [createReview, setCreateReview] = useState(false);
    const [reviewContent, setReviewContent] = useState("");
    const [ratingValue, setRatingValue] = useState<number|null>(5);
    const [ratingHover, setRatingHover] = useState(-1);
    const router = useRouter();


    const createHandler = async ()=> {
        if(reviewContent===null||reviewContent.trim().length===0){alert("리뷰 내용을 적어주세요."); return;}
        const data = {
            rating: ratingValue,
            content: reviewContent
        }
        const res = await authApi.post<ProductReviewsDto[]>(`/product/reviews/create/${productId}`, data);
        if(res.status!==200) {alert("리뷰 작성에 실패했습니다."); return;}
        setProductReviews(res.data);
    }

    const ratingChangeHandler = (e:SyntheticEvent, newValue:number|null) => {
        console.log("별점 변경"+newValue);
        if(!newValue) {return;}
        setRatingHover(newValue);
    }
    
    return (
        <Box sx={{marginY: 2}}>
            {createReview?
                <Box>
                    <Typography component="legend">별점 선택</Typography>
                    <Rating
                        value={ratingValue}
                        precision={0.5}
                        onChange={(e, newValue) => {
                            setRatingValue(newValue !== null ? newValue : ratingValue);
                        }}
                        onChangeActive={(e, newHover) => {
                            setRatingHover(newHover !== null ? newHover : ratingHover);
                        }}
                        emptyIcon={<StarIcon style={{opacity: 0.55}} fontSize="inherit"/>}
                    />
                    <br/>
                    <TextField
                        label="리뷰 내용을 적어주세요."
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        sx={{marginY: 2}}
                    >
                    </TextField>
                    <br/>
                    <Button onClick={createHandler}
                            sx={{backgroundColor: "#FFDF00", color: "#000000"}}>리뷰 작성</Button>
                    <Button onClick={() => setCreateReview(false)}
                    sx={{backgroundColor: "#000000", color: "#FFFFFF", marginX: 2}}>작성 취소</Button>
                </Box>
                :
                <Button onClick={()=>setCreateReview(true)}
                        sx={{backgroundColor: "#FFDF00", color: "#000000"}}>리뷰 작성</Button>
            }
        </Box>
    )
}