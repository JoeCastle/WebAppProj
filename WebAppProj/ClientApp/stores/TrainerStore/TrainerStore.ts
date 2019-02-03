import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import CreateGroupDetails from '../../models/createGroupDetails';
import { api } from '../../api';

class TrainerStore {
    @observable groupName = "";

    @action
    public createGroup = async (): Promise<boolean> => {
        //Validate username and password, potentially do this in the component.
        //Check we exist in database.
        //Log the user in.
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