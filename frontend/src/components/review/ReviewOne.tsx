import {Box, Paper, Typography} from "@mui/material";
import {ProductReviewsDto} from "@/types/productReviewType";
import dayjs from "dayjs";

type ReviewOne = {
    productReview: ProductReviewsDto
}

export default function ReviewOne({productReview}:ReviewOne) {

    return (
        <Box>
            <Paper>
                <Typography>
                {productReview.rating}|{productReview.usersDto.email} | {dayjs(productReview.createdAt).format('YYYY-MM-DD')}
                </Typography>
                <Typography>
                    {productReview.content}
                </Typography>
            </Paper>
        </Box>
    )
}