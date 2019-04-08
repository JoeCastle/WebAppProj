import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import { api } from '../../api';
import CreateQuizDetails from '../../models/CreateQuiz/createQuizDetails';
import CreateQuestionDetails from '../../models/CreateQuiz/createQuestionDetails';
import CreateChoiceDetails from '../../models/CreateQuiz/createChoiceDetails';
import QuizDetails from '../../models/GetQuiz/quizDetails';
import TraineeGetQuizzes from '../../models/traineeGetQuizzes';
import SubmitQuizResultsDetails from '../../models/submitQuizResultsDetails';
import QuizResults from '../../models/GetQuizResults/quizResults';
import TraineeGetQuizResults from '../../models/traineeGetQuizResults';

class QuizStore {
    @observable quiz: CreateQuizDetails;
    @observable questions: string[];
    @observable choicesText: string[];

    @observable quizzesDetails: QuizDetails[] = [];
    @observable quizzesDetailsFiltered: QuizDetails[] = [];
    @observable quizDetails: QuizDetails;

    @observable choicesCorrect: boolean[];
    private quizName: string;

    @observable userChoicesForm: boolean[];
    private userChoices: boolean[];
    private questionResults: number[];

    @observable activeRadioIndexes: number[];

    @observable submitQuizResultsDetails: SubmitQuizResultsDetails[] = [];

    @observable quizResults: QuizResults;
    @observable quizTotal: number;

    constructor() {
        this.quiz = {} as CreateQuizDetails;
        this.questions = new Array(5).fill("");
        this.choicesText = new Array(20).fill("");
        this.choicesCorrect = new Array(20).fill(false);
        this.quizDetails = {} as QuizDetails;
        this.userChoices = new Array(20).fill(false);
        this.userChoicesForm = new Array(20).fill(false);
        this.questionResults = new Array(5).fill(0);
        this.activeRadioIndexes = new Array(5).fill(0);
        this.quizResults = {} as QuizResults;
        this.quizTotal = 0;
    }

    //Creates a new quiz, used by a trainer.
    @action
    public createQuiz = async (): Promise<boolean> => {
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        await this.buildQuizDTO();

        if (trainerHasGroup) {
            let response: Response = await api.createQuiz(this.quiz);

            if (response) {
                return true;

            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    //Submits an existing quiz, used by a trainee.
    @action
    public submitQuiz = async (): Promise<boolean> => {
        let isTrainee = authStore.isLoggedIn && authStore.userRole == "trainee";
        let traineeHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainee;

        if (traineeHasGroup) {
            this.markQuiz();

            for (let i = 0; i < this.questionResults.length; i++) {

                let submitQuizResultsDetails: SubmitQuizResultsDetails = {
                    userID: authStore.userID,
                    quizID: this.quizDetails.quizID,
                    questionID: this.quizDetails.questions[i].questionID,
                    resultValue: this.questionResults[i]
                };

                this.submitQuizResultsDetails.push(submitQuizResultsDetails);
            }

            let response: Response = await api.submitQuizResults(this.submitQuizResultsDetails);

            if (response) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    //Marks a quiz completed by a trainee.
    @action
    private markQuiz = (): void => {
        let quizDetails: QuizDetails = this.quizDetails;

        this.questionResults = new Array(5).fill(0);

        let counter: number = 0;

        for (let i = 0; i < quizDetails.questions.length; i++) {

            let isAnswerCorrect = true;

            for (let j = 0; j < quizDetails.questions[i].choices.length; j++) {

                if (quizDetails.questions[i].choices[j].isCorrect != this.userChoicesForm[counter]) {
                    isAnswerCorrect = false;
                }
                counter++;
            }

            if (isAnswerCorrect) {
                this.questionResults[i] = 1;
            } else {
                this.questionResults[i] = 0;
            }
        }

        this.userChoices = this.userChoicesForm;
    }

    //Gets a list of all quizzes that belong to a group.
    @action
    public getAllQuizzesforGroup = async (): Promise<void> => {
        let isLoggedIn = authStore.isLoggedIn;
        let userHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isLoggedIn;

        if (userHasGroup) {
            let quizzesDetails: QuizDetails[] = await api.getAllQuizzesforGroup(authStore.userGroupID);

            if (quizzesDetails) {

                this.setQuizzesDetails(quizzesDetails);
            } else {

            }
        } else {

        }
    }

    //Gets a specific quiz by quiz ID.
    @action
    public getQuizByQuizID = async (quizID: number): Promise<void> => {
        let isLoggedIn = authStore.isLoggedIn;
        let userHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isLoggedIn;

        if (userHasGroup) {
            let quizDetails: QuizDetails = await api.getQuizByQuizID(quizID);

            if (quizDetails) {
                this.setQuizDetails(quizDetails);
            } else {

            }
        } else {

        }
    }

    //Gets a list of all uncompleted quizzes for a trainee.
    @action
    public getUncompletedQuizzesForTrainee = async (): Promise<void> => {
        let isLoggedIn = authStore.isLoggedIn;
        let userHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isLoggedIn;

        var DTO: TraineeGetQuizzes = {
            groupID: authStore.userGroupID,
            userID: authStore.userID
        }

        if (userHasGroup) {
            let quizzesDetails: QuizDetails[] = await api.getUncompletedQuizzesForTrainee(DTO);

            if (quizzesDetails) {

                this.setQuizzesDetails(quizzesDetails);
            } else {

            }
        } else {

        }
    }

    //Gets a list of all completed quizzes for a trainee.
    @action
    public getCompletedQuizzesForTrainee = async (): Promise<void> => {
        let isLoggedIn = authStore.isLoggedIn;
        let userHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isLoggedIn;

        var DTO: TraineeGetQuizzes = {
            groupID: authStore.userGroupID,
            userID: authStore.userID
        }

        if (userHasGroup) {
            let quizzesDetails: QuizDetails[] = await api.getCompletedQuizzesForTrainee(DTO);

            if (quizzesDetails) {

                this.setQuizzesDetails(quizzesDetails);
            } else {

            }
        } else {

        }
    }

    //Gets a trainees result for a specific quiz.
    @action
    public getQuizResults = async (quizID: number): Promise<void> => {
        let isLoggedIn = authStore.isLoggedIn;
        let userHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isLoggedIn;

        var DTO: TraineeGetQuizResults = {
            quizID: quizID,
            userID: authStore.userID
        }

        if (userHasGroup) {
            let quizResults: QuizResults = await api.getQuizResults(DTO);

            if (quizResults) {
                this.setQuizResults(quizResults);
                this.setQuizTotal();
            } else {

            }
        } else {

        }
    }

    /*
     * The folowwing actions/functions handle changes to input values and/or set the value of an observable.
     */
    @action
    public resetStore = async (): Promise<void> => {
        this.quizDetails = {} as QuizDetails;
        this.quizzesDetails = [];
        this.quizTotal = 0;
        this.quizResults = {} as QuizResults;
        this.quizzesDetails = [];
        this.quizzesDetailsFiltered = [];
    }

    @action
    private setQuizDetails = (quizDetails: QuizDetails): void => {
        this.quizDetails = quizDetails;
    }

    @action
    private setQuizResults = (quizResults: QuizResults): void => {
        this.quizResults = quizResults;
    }

    @action
    private setQuizTotal = (): void => {
        for (let i: number = 0; i < this.quizResults.questions.length; i++) {
            this.quizTotal = this.quizTotal + this.quizResults.questions[i].result;
        }
    }

    @action
    private setQuizzesDetails = (quizzesDetails: QuizDetails[]): void => {
        for (let quiz in quizzesDetails) {
            this.quizzesDetails[quiz] = quizzesDetails[quiz];
        }

        this.quizzesDetailsFiltered.push(...this.quizzesDetails);
    }

    @action
    private buildQuizDTO = async(): Promise<void> => {
        let createdQuiz: CreateQuizDetails = {
            groupID: authStore.userGroupID,
            quizName: this.quizName,
            createdQuestions: []
        }

        //Set question text.
        for (let i: number = 0; i < 5; i++) {
            let createdQuestion: CreateQuestionDetails = {
                questionText: this.questions[i],
                createdChoices: []
            }

            //Set choice text and choice is correct.
            for (let j: number = 0; j < 4; j++) {
                let index = j + (i * 4);

                let createdChoices: CreateChoiceDetails = {
                    choiceText: this.choicesText[index],
                    isCorrect: this.choicesCorrect[index]
                }
                createdQuestion.createdChoices.push(createdChoices);
            }

            createdQuiz.createdQuestions.push(createdQuestion);
        }

        this.quiz = createdQuiz;
    }

    @action
    public onQuizNameChange = (quizName: string): void => {
        this.quizName = quizName;
    }

    @action
    public onQuestionTextChange = (questionText: string, questionID: number): void => {
        this.questions[questionID] = questionText;
    }

    @action
    public onChoiceTextChange = (choiceText: string, questionID: number, choiceID: number): void => {
        let index = choiceID + (questionID * 4);
        this.choicesText[index] = choiceText;
    }

    @action
    public onChoiceIsCorrectChange = (isCorrect: string, questionID: number, choiceID: number): void => {
        //Get the total index for the current choice. (Converts 0-3 to 0-20)
        //Learned from CUDA on the HPC module.
        let index = choiceID + (questionID * 4);

        this.activeRadioIndexes[questionID] = index;

        //TODO: Get boolean value
        if (isCorrect == "on") {
            this.choicesCorrect[index] = true;

            //Reset other grouped value to false
            for (let i: number = 0; i < 4; i++) {
                let j = i + (questionID * 4);

                if (index != j) {
                    this.choicesCorrect[j] = false;
                }
            }
        } else {
            this.choicesCorrect[index] = false;
        }
    }

    @action
    public onUserChoiceChange = async (choice: string, questionID: number, choiceID: number): Promise<void> => {
        //Get the total index for the current choice. (Converts 0-3 to 0-19)
        //Learned from CUDA on the HPC module.
        let index = choiceID + (questionID * 4);

        //TODO: Get boolean value
        if (choice == "on") {
            this.userChoicesForm[index] = true;

            //Reset other grouped value to false
            for (let i: number = 0; i < 4; i++) {
                
                let j = i + (questionID * 4);

                if (index != j) {
                    this.userChoicesForm[j] = false;
                }
            }
        } else {
            this.userChoicesForm[index] = false;
        }
    }
}

const quizStore = new QuizStore();

export default quizStore;
export { QuizStore };