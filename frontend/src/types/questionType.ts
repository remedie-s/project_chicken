import {number} from "prop-types";

export type QuestionDto = {
    id: number,
    title: string,
    content: string,
    createTime: Date
}