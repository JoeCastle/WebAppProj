import QuestionDetails from "./questionDetails";

//1 quiz
export default interface QuizDetails {
    quizName?: string;
    groupID?: number;
    quizID?: number
    questions: QuestionDetails[];
}
