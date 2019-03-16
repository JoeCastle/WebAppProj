import QuestionDetails from "./questionDetails";

//1 quiz
export default interface QuizResults {
    quizName?: string;
    groupID?: number;
    quizID?: number
    questions: QuestionDetails[];
}
