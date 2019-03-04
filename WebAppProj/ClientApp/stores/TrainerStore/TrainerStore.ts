import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import CreateGroupDetails from '../../models/createGroupDetails';
import { api } from '../../api';

class TrainerStore {
    @observable groupName = "";

    //TODO: Move to group store.
    @action
    public createGroup = async (): Promise<boolean> => {
        if (this.groupName != "") {
            //Create data transfer object
            let createGroupDetailsDTO: CreateGroupDetails = {
                groupName: this.groupName,
                userID: authStore.userID
            }

            //Use fetch to call the login controller
            let groupCreated: Response = await api.createGroup(createGroupDetailsDTO);

            if (groupCreated) {
                return true
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    @action
    public onGroupnameChange = (groupName: string): void => {
        this.groupName = groupName;
    }
}

const trainerStore = new TrainerStore();

export default trainerStore;
export { TrainerStore };