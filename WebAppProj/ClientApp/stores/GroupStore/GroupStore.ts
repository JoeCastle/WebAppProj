import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import CreateGroupDetails from '../../models/createGroupDetails';
import { api } from '../../api';
import UserDetails from '../../models/userDetails';
import UsersToAddToGroup from '../../models/usersToAddToGroup';

class GroupStore {
    @observable groupName = "";
    @observable groupUsers: UserDetails[] = [];
    @observable groupUsersFiltered: UserDetails[] = [];
    @observable nonGroupUsers: UserDetails[] = [];
    @observable nonGroupUsersFiltered: UserDetails[] = [];
    @observable selectedUsers: UserDetails[] = [];

    @action
    public createGroup = async (): Promise<boolean> => {

        if (this.groupName != "") {
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
    public getCurrentGroupUsers = async (): Promise<void> => {
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        let groupID = authStore.userGroupID;

        if (trainerHasGroup) {
            let groupUsers: UserDetails[] = await api.getCurrentGroupUsers(groupID);

            if (groupUsers) {
                this.setGroupUsers(groupUsers)
            } else {

            }
        }
    }

    @action
    public getUsersNotInGroup = async (): Promise<void> => {
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        if (trainerHasGroup) {
            let nonGroupUsers: UserDetails[] = await api.getUsersNotInGroup();

            if (nonGroupUsers) {

                this.setNonGroupUsers(nonGroupUsers)

            } else {

            }
        }
    }

    @action
    public addUsersToGroup = async (): Promise<boolean> => {
        //Move to dedicated function, to reduce code. (Move to auth store?)
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        let selectedUsers: UserDetails[] = [];

        for (let i = 0; i < this.selectedUsers.length; i++) {
            selectedUsers[i] = this.selectedUsers[i];
        }

        //Create data transfer object
        let DTO: UsersToAddToGroup = {
            userDetails: selectedUsers,
            groupID: authStore.userGroupID
        }

        if (trainerHasGroup) {
            let response: Response = await api.addUsersToGroup(DTO);

            if (response) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    @action
    public removeUsersFromGroup = async (): Promise<boolean> => {

        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        let selectedUsers: UserDetails[] = [];

        for (let i = 0; i < this.selectedUsers.length; i++) {
            selectedUsers[i] = this.selectedUsers[i];
        }

        //Create data transfer object
        let DTO: UsersToAddToGroup = {
            userDetails: selectedUsers,
            groupID: authStore.userGroupID
        }

        if (trainerHasGroup) {
            let response: Response = await api.removeUsersFromGroup(DTO);

            if (response) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
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
    public resetStore = async (): Promise<void> => {
        this.nonGroupUsers = [];
        this.groupUsers = [];
        this.nonGroupUsersFiltered = [];
        this.groupUsersFiltered = [];
    }

    @action
    public onGroupnameChange = (groupName: string): void => {
        this.groupName = groupName;
    }

    @action
    private setNonGroupUsers = (nonGroupUsers: UserDetails[]): void => {
        for (let user in nonGroupUsers) {
            this.nonGroupUsers[user] = nonGroupUsers[user];
        }

        this.nonGroupUsersFiltered.push(...this.nonGroupUsers);
    }

    @action
    private setGroupUsers = (groupUsers: UserDetails[]): void => {
        for (let user in groupUsers) {
            this.groupUsers[user] = groupUsers[user];
        }

        this.groupUsersFiltered.push(...this.groupUsers);
    }

    @action
    public setSelectedUsers = (selectedUsers: UserDetails[]): void => {
        for (let user in selectedUsers) {
            this.selectedUsers[user] = selectedUsers[user];
        }
    }
}

const groupStore = new GroupStore();

export default groupStore;
export { GroupStore };