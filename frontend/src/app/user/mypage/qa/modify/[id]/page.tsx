import QuestionForm from "@/components/question/QuestionForm";

export default function page({params}: { params: { id: string } }){
    const {id} = params;
    return (
        <QuestionForm questionId={Number(id)} modifyRequest={true}/>
    )
}