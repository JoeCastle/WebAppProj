import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import { api } from '../../api';
import UserDetails from '../../models/userDetails';
import CreateQuizDetails from '../../models/CreateQuiz/createQuizDetails';

class QuizStore {
    @observable quiz: CreateQuizDetails | undefined;

    @action
    public createQuiz = async (): Promise<void> => {
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        if (trainerHasGroup) {
            let nonGroupUsers: UserDetails[] = await api.getUsersNotInGroup();

            if (nonGroupUsers) {

                //this.setNonGroupUsers(nonGroupUsers)

            } else {
                //return false;
            }
        }

        //return true;
    }
}

const quizStore = new QuizStore();

export default quizStore;
export { QuizStore };