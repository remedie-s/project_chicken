import {Button, Paper, TextField} from "@mui/material";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {QuestionDto} from "@/types/questionType";
import {useState} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

export default function QuestionCreate() {
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const router = useRouter();

    const questionCreateHandler = async () =>{
        // TODO 차후 주소 수정
        const res = axios.post("http://localhost:8080")
    }

    return (
        <Paper sx={{ height: 400, width: '100%' }}>
            <TextField
                id="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}/>
            <TextField
                id="content"
                value={content}
                onChange={(e)=>setContent(e.target.value)}/>
            <Button
                onClick={questionCreateHandler}>
                작성
            </Button>
            <Button
            onClick={() => router.back()}>
                작성 취소
            </Button>
        </Paper>
    );
}