import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import { api } from '../../api';
import UserDetails from '../../models/userDetails';
import CreateQuizDetails from '../../models/CreateQuiz/createQuizDetails';
import CreateQuestionDetails from '../../models/CreateQuiz/createQuestionDetails';
import CreateChoiceDetails from '../../models/CreateQuiz/createChoiceDetails';
import { CreateQuiz } from '../../components/trainer/CreateQuiz';

class QuizStore {
    //@observable quiz: CreateQuizDetails;
    //@observable questions: CreateQuestionDetails[];
    //@observable choices: CreateChoiceDetails[];

    //@observable quiz: CreateQuizDetails;
    //@observable questions: Array<CreateQuestionDetails> = new Array(5);
    //@observable choices: CreateChoiceDetails[];

    @observable quiz: CreateQuizDetails;
    @observable questions: string[];
    @observable choicesText: string[];
    private choicesCorrect: boolean[];
    private quizName: string;

    //private choicesText2: string[];

    constructor() {
        this.quiz = {} as CreateQuizDetails;
        //this.quiz.createdQuestions = [] as CreateQuestionDetails[];
        //this.quiz.createdQuestions[].createdChoices = [] as CreateChoiceDetails[];
        //this.quiz.createdQuestions[].createdChoices = [];

        this.questions = new Array(5).fill("");
        this.choicesText = new Array(20).fill("");
        this.choicesCorrect = new Array(20).fill(false);

        //this.questions = [{}] as CreateQuestionDetails[];
        //this.choices = [{}] as CreateChoiceDetails[];

        //this.questions = [];
        //this.choices = [];

    }

    @action
    public createQuiz = async (): Promise<void> => {
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        await this.buildQuizDTO();

        debugger;

        if (trainerHasGroup) {
            let response: Response = await api.createQuiz(this.quiz);

            debugger;

            if (response) {

                //this.setNonGroupUsers(nonGroupUsers)

            } else {
                //return false;
            }
        }

        //return true;
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