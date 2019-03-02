import ChoiceDetails from "./choiceDetails";

export default interface QuestionDetails {
    questionText: string;
    quizID: number;
    questionID: number;
    choices: ChoiceDetails[];
}
