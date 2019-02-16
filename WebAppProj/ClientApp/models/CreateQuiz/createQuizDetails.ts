import CreateQuestionDetails from "./createQuestionDetails";

//1 quiz
export default interface CreateQuizDetails {
    quizName?: string;
    groupID?: number;
    createdQuestions: CreateQuestionDetails[];
}
