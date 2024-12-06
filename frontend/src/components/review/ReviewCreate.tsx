"use client"
import {Box, Button, TextField} from "@mui/material";
import {useState} from "react";
import authApi from "@/scripts/auth/authApi";

export default function ReviewCreate() {
    const [createReview, setCreateReview] = useState(false);
    const [reviewContent, setReviewContent] = useState("");
    const createHandler = async ()=> {
        if(reviewContent===null||reviewContent.trim().length===0){alert("리뷰 내용을 적어주세요."); return;}
        // TODO 리뷰 작성 기능 구현하는 곳
        // const res = await authApi.post("")
    }
    
    return (
        <Box>
            {createReview?
                <Box>
            <TextField 
                label="리뷰를 적어주세요."
                value={reviewContent}
                onChange={(e)=>setReviewContent(e.target.value)}
            >
            </TextField>
            <Button onClick={createHandler}>리뷰 작성</Button>
            <Button onClick={()=>setCreateReview(false)}>작성 취소</Button>
                </Box>
                :
            <Button onClick={()=>setCreateReview(true)}>리뷰 작성</Button>
            }
        </Box>
    )
}