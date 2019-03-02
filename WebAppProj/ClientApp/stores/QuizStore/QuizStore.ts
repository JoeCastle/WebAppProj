import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import { api } from '../../api';
import UserDetails from '../../models/userDetails';
import CreateQuizDetails from '../../models/CreateQuiz/createQuizDetails';
import CreateQuestionDetails from '../../models/CreateQuiz/createQuestionDetails';
import CreateChoiceDetails from '../../models/CreateQuiz/createChoiceDetails';
import { CreateQuiz } from '../../components/trainer/CreateQuiz';
import QuizDetails from '../../models/GetQuiz/quizDetails';

class QuizStore {
    @observable quiz: CreateQuizDetails;
    @observable questions: string[];
    @observable choicesText: string[];

    @observable quizzesDetails: QuizDetails[] = [];

    private choicesCorrect: boolean[];
    private quizName: string;

    //private choicesText2: string[];

    constructor() {
        this.quiz = {} as CreateQuizDetails;
        this.questions = new Array(5).fill("");
        this.choicesText = new Array(20).fill("");
        this.choicesCorrect = new Array(20).fill(false);
    }

    @action
    public createQuiz = async (): Promise<boolean> => {
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        await this.buildQuizDTO();

        debugger;

        if (trainerHasGroup) {
            let response: Response = await api.createQuiz(this.quiz);

            //debugger;

            if (response) {

                //this.setNonGroupUsers(nonGroupUsers)
                return true;

            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    @action
    public getAllQuizzesforGroup = async (): Promise<void> => {
        let isLoggedIn = authStore.isLoggedIn;
        let userHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isLoggedIn;

        debugger;

        if (userHasGroup) {
            let quizzesDetails: QuizDetails[] = await api.getAllQuizzesforGroup(authStore.userGroupID);

            debugger;

            if (quizzesDetails) {

                this.setQuizzesDetails(quizzesDetails);
            } else {

            }
        } else {

        }
    }

    @action
    private setQuizzesDetails = (quizzesDetails: QuizDetails[]): void => {
        for (let quiz in quizzesDetails) {
            this.quizzesDetails[quiz] = quizzesDetails[quiz];
        }
    }

    //TODO: Fix the iscorrect value being incorrect. Sometimes multiple radio options are true in one group.
    @action
    private buildQuizDTO = async(): Promise<void> => {
        debugger;

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
}

const quizStore = new QuizStore();

export default quizStore;
export { QuizStore };