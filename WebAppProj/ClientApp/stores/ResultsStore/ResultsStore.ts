import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import { api } from '../../api';
import QuizDetails from '../../models/GetQuiz/quizDetails';
import TraineeByQuizDetails from '../../models/TraineeByQuizDetails';

//Export data object.
interface exportData {
    traineeusername: string;
    firstname: string;
    surname: string;
    result: number;
}

class ResultStore {
    @observable quizzesDetails: QuizDetails[] = []; //Array of quiz details.
    @observable quizzesDetailsFiltered: QuizDetails[] = []; //Filtered array of quiz details.

    @observable traineesByQuiz: TraineeByQuizDetails[] = []; //Array of trainees that have completed a quiz.
    @observable traineesByQuizFiltered: TraineeByQuizDetails[] = []; //Filtered array of trainees that have completed a quiz.

    @observable averageQuizScore: number = 0;

    @observable headersExport = [
        { label: "Username", key: "traineeusername" },
        { label: "First Name", key: "firstname" },
        { label: "Surname", key: "surname" },
        { label: "Result", key: "result" }
    ];

    @observable dataExport: exportData[];

    constructor() {
        this.dataExport = new Array();
    }

    //Gets a list of all quizzes that belong to the current users group.
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

    //Gets a list of trainee results for a specific quiz.
    @action
    public getTraineesResultsByQuizID = async (quizID: number): Promise<void> => {
        let isLoggedIn = authStore.isLoggedIn;
        let userHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isLoggedIn;

        if (userHasGroup) {
            let traineesByQuiz: TraineeByQuizDetails[] = await api.getTraineesResultsByQuizID(quizID);

            if (traineesByQuiz) {
                this.setTraineesByQuiz(traineesByQuiz);
            } else {

            }
        } else {

        }
    }

    /*
     * The folowwing actions/functions handle changes to input values and/or set the value of an observable.
     */
    @action
    private setQuizzesDetails = (quizzesDetails: QuizDetails[]): void => {
        for (let quiz in quizzesDetails) {
            this.quizzesDetails[quiz] = quizzesDetails[quiz];
        }

        this.quizzesDetailsFiltered.push(...this.quizzesDetails);
    }

    @action
    private setTraineesByQuiz = (traineesByQuiz: TraineeByQuizDetails[]): void => {
        let dataExportTemp: exportData[] = [];

        this.averageQuizScore = 0;

        for (let trainee in traineesByQuiz) {
            this.traineesByQuiz[trainee] = traineesByQuiz[trainee];

            let item: exportData = { traineeusername: this.traineesByQuiz[trainee].username || "N/A", firstname: this.traineesByQuiz[trainee].firstname, surname: this.traineesByQuiz[trainee].surname, result: this.traineesByQuiz[trainee].result }

            dataExportTemp.push(item);

            this.averageQuizScore = this.averageQuizScore + traineesByQuiz[trainee].result;

        }

        this.averageQuizScore = this.averageQuizScore / traineesByQuiz.length;

        this.dataExport.push(...dataExportTemp);

        this.traineesByQuizFiltered.push(...this.traineesByQuiz);
    }


    @action
    public resetStore = async (): Promise<void> => {
        this.quizzesDetails = [];
        this.traineesByQuiz = [];
        this.traineesByQuizFiltered = [];
        this.dataExport = [];
        this.averageQuizScore = 0;
    }
}

const resultStore = new ResultStore();

export default resultStore;
export { ResultStore };