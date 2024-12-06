import {number} from "prop-types";
import {AnswersDto} from "@/types/answerType";

export type QuestionDto = {
    id: number,
    title: string,
    content: string,
    createTime: Date,
    answerCheck: boolean,
    answers: AnswersDto[]|null,
    userId: number
}