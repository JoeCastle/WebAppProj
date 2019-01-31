import { observable, computed, reaction, action } from 'mobx';

class TraineeStore {
    @observable TraineeTestvar = "TraineeTest";

    @action
    public traineeTest = (): void => {
        console.log(this.TraineeTestvar);

    }
}

const traineeStore = new TraineeStore();

export default traineeStore;
export { TraineeStore };