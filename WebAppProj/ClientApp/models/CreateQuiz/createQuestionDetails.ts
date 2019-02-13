import CreateChoiceDetails from "./createChoiceDetails";

//10 questions
export default interface CreateQuestionDetails {
    questionText: string;
    createdChoices: CreateChoiceDetails[];
}
