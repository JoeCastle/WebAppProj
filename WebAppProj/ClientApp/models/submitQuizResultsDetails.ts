export default interface SubmitQuizResultsDetails {
    questionID: number;
    userID: number;
    resultValue: number;
    quizID?: number;
}
