import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import { api } from '../../api';
import QuizDetails from '../../models/GetQuiz/quizDetails';
import TraineeByQuizDetails from '../../models/TraineeByQuizDetails';

class ResultStore {

    @observable quizzesDetails: QuizDetails[] = [];

    @observable traineesByQuiz: TraineeByQuizDetails[] = [];

    @observable headersExport = [
        { label: "Username", key: "traineeusername" },
        { label: "First Name", key: "firsrname" },
        { label: "Surname", key: "surname" },
        { label: "Result", key: "result" }
    ];

    @observable dataExport = [
        { traineeusername: "Yezzi", firsrname: "Min l3b", surname: "ymin@cocococo.com", result: "test" }
    ];

//    headers = observable([
//        { label: "Username", key: "traineeusername" },
//        { label: "First Name", key: "firsrname" },
//        { label: "Surname", key: "surname" },
//        { label: "Result", key: "result" }
//]);

    //@observable dataExport: string[];

    constructor() {
        //this.data = new Array(5).fill("");
        this.dataExport = [];
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
        debugger;
        for (let trainee in traineesByQuiz) {
            this.traineesByQuiz[trainee] = traineesByQuiz[trainee];
            //let item = `{ traineeusername: ${this.traineesByQuiz[trainee].username || "N/A"}, firstname: ${this.traineesByQuiz[trainee].firstname}, surname: ${this.traineesByQuiz[trainee].surname}, result: ${this.traineesByQuiz[trainee].result} }`
            let item = { traineeusername: this.traineesByQuiz[trainee].username || "N/A", firstname: this.traineesByQuiz[trainee].firstname, surname: this.traineesByQuiz[trainee].surname, result: this.traineesByQuiz[trainee].result }
            this.dataExport.push(item);
        }

        debugger;
    }

    @action
    public resetStore = async (): Promise<void> => {
        
    }
}

const resultStore = new ResultStore();

export default resultStore;
export { ResultStore };