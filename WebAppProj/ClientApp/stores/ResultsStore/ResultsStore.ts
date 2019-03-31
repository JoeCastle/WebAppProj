import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import { api } from '../../api';
import QuizDetails from '../../models/GetQuiz/quizDetails';
import TraineeByQuizDetails from '../../models/TraineeByQuizDetails';

class ResultStore {

    @observable quizzesDetails: QuizDetails[] = [];

    @observable traineesByQuiz: TraineeByQuizDetails[] = [];

    constructor() {
        
    }

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

    @action
    public getTraineesResultsByQuizID = async (quizID: number): Promise<void> => {
        let isLoggedIn = authStore.isLoggedIn;
        let userHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isLoggedIn;

        if (userHasGroup) {
            let traineesByQuiz: TraineeByQuizDetails[] = await api.getTraineesResultsByQuizID(quizID);

            if (traineesByQuiz) {
                this.setTraineesByQuiz(traineesByQuiz);
                //debugger;
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

    @action
    private setTraineesByQuiz = (traineesByQuiz: TraineeByQuizDetails[]): void => {
        for (let trainee in traineesByQuiz) {
            this.traineesByQuiz[trainee] = traineesByQuiz[trainee];
        }
    }

    @action
    public resetStore = async (): Promise<void> => {
        
    }
}

const resultStore = new ResultStore();

export default resultStore;
export { ResultStore };