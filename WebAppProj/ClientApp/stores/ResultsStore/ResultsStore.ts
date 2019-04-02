import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import { api } from '../../api';
import QuizDetails from '../../models/GetQuiz/quizDetails';
import TraineeByQuizDetails from '../../models/TraineeByQuizDetails';

interface bar {
    traineeusername: string;
    firstname: string;
    surname: string;
    result: number;
}

class ResultStore {

    @observable quizzesDetails: QuizDetails[] = [];

    @observable traineesByQuiz: TraineeByQuizDetails[] = [];
    @observable traineesByQuizFiltered: TraineeByQuizDetails[] = [];

    @observable headersExport = [
        { label: "Username", key: "traineeusername" },
        { label: "First Name", key: "firstname" },
        { label: "Surname", key: "surname" },
        { label: "Result", key: "result" }
    ];

    @observable dataExport: bar[];

//    headers = observable([
//        { label: "Username", key: "traineeusername" },
//        { label: "First Name", key: "firsrname" },
//        { label: "Surname", key: "surname" },
//        { label: "Result", key: "result" }
//]);


    constructor() {
        this.dataExport = new Array();
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
        let dataExportTemp: bar[] = [];

        for (let trainee in traineesByQuiz) {
            this.traineesByQuiz[trainee] = traineesByQuiz[trainee];

            let item: bar = { traineeusername: this.traineesByQuiz[trainee].username || "N/A", firstname: this.traineesByQuiz[trainee].firstname, surname: this.traineesByQuiz[trainee].surname, result: this.traineesByQuiz[trainee].result }

            dataExportTemp.push(item);
        }

        this.dataExport.push(...dataExportTemp);

        this.traineesByQuizFiltered.push(...this.traineesByQuiz);
    }


    @action
    public resetStore = async (): Promise<void> => {
        this.quizzesDetails = [];
        this.traineesByQuiz = [];
        this.traineesByQuizFiltered = [];
        this.dataExport = [];
    }
}

const resultStore = new ResultStore();

export default resultStore;
export { ResultStore };