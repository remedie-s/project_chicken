import {Box} from "@mui/material";

import {Paper} from "@mui/material";
import {DataGrid, GridColDef} from '@mui/x-data-grid';
import {QuestionDto} from "@/types/questionType";
import {useEffect, useState} from "react";
import axios from "axios";

export default function MypageQuestion() {
    const paginationModel = {page: 0, pageSize: 5};
    const columns: GridColDef[] = [
        {field: 'title', headerName: '문의명', width: 300},
        {field: 'createTime', headerName: '작성일', width: 150}
    ];
    const [questionList,setQuestionList] = useState<QuestionDto[]|null>();

    const dummyQuestion = [
        {id: 1, title: "title", createTime: '2024-11-24'},
        {id: 2, title: 'Lannister', createTime: '2024-11-20'},
        {id: 3, title: 'Lannister', createTime: '2024-10-10'},
        {id: 4, title: 'Stark', createTime: '2024-12-10'},
        {id: 5, title: 'Targaryen', createTime: '2024-11-11'},
        {id: 6, title: 'Melisandre', createTime: "2024-11-23"},
        {id: 7, title: 'Clifford', createTime: "2024-10-05"},
        {id: 8, title: 'Frances', createTime: "2024-09-10"},
        {id: 9, title: 'Roxie', createTime: '2024-09-20'},
    ];
    // TODO 차후 주소 수정
    // useEffect(async () => {
    //     const res = await axios.post<QuestionDto[]>("http://localhost:8080");
    //     if(res.status!==200) alert("문의 정보 불러오기에 실패했습니다.")
    //     setQuestionList(res.data);
    // }, []);


    return (
        <Box sx={{ width: "100%"}}>
        <Paper sx={{height: 400, width: '100%'}}>
            <DataGrid
                rows={dummyQuestion}
                columns={columns}
                initialState={{pagination: {paginationModel}}}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                sx={{border: 0}}
            />
        </Paper>
        </Box>
    );
}