import { observable, computed, reaction, action } from 'mobx';

//TODO: Check the validity of the JWT on the server when navigating/on page refresh.

class TraineeStore {
    @observable TraineeTestvar = "TraineeTest";


    @action
    public traineeTest = (): void => {
        console.log(this.TraineeTestvar);
        //debugger;

    }
}

const traineeStore = new TraineeStore();

export default traineeStore;
export { TraineeStore };