import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import CreateGroupDetails from '../../models/createGroupDetails';
import { api } from '../../api';
import UserDetails from '../../models/userDetails';

class GroupStore {
    @observable groupUsers: UserDetails[] = [];
    @observable nonGroupUsers: UserDetails[] = [];
    todos = observable([
    { title: "Spoil tea", completed: true },
    { title: "Make coffee", completed: false }
]);

    @action
    public getCurrentGroupUsers = async (): Promise<void> => {
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        let groupID = authStore.userGroupID;

        if (trainerHasGroup) {
            let groupUsers: UserDetails[] = await api.getCurrentGroupUsers(groupID);

            if (groupUsers) {
                this.groupUsers = groupUsers;

                debugger;

                //return this.groupUsers;
            } else {
                //return false;
            }
        }

        //return true;
    }

    @action
    public getUsersNotInGroup = async (): Promise<void> => {
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        if (trainerHasGroup) {
            let nonGroupUsers: UserDetails[] = await api.getUsersNotInGroup();

            if (nonGroupUsers) {
                //this.nonGroupUsers = nonGroupUsers;

                console.log("joetest: ");
                console.log(nonGroupUsers);

                debugger;

                this.setNonGroupUsers(nonGroupUsers)

                debugger;

                //return this.groupUsers;
            } else {
                //return false;
            }
        }

        //return true;
    }

    @action
    public getCurrentGroupDetails = async (): Promise<boolean> => {
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        let groupID = authStore.userGroupID;

        if (trainerHasGroup) {
            let groupDetails: Response = await api.getCurrentGroupDetails(groupID);
        }

        return true;
    }

    @action
    private setNonGroupUsers = (nonGroupUsers: UserDetails[]): void => {

        for (let user in nonGroupUsers) {
            this.nonGroupUsers[user] = nonGroupUsers[user];

            debugger;
        }

        debugger;
    }
}

const groupStore = new GroupStore();

export default groupStore;
export { GroupStore };