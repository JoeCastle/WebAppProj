import { observable, computed, reaction, action } from 'mobx';
import authStore from '../AuthStore/AuthStore';
import CreateGroupDetails from '../../models/createGroupDetails';
import { api } from '../../api';
import UserDetails from '../../models/userDetails';
import UsersToAddToGroup from '../../models/usersToAddToGroup';

class GroupStore {
    @observable groupName = ""; //Group name of "Create group" form input.
    @observable groupUsers: UserDetails[] = []; //Array of users that belong to the current group.
    @observable groupUsersFiltered: UserDetails[] = []; //Filtered version of the array of users that belong to the current group.
    @observable nonGroupUsers: UserDetails[] = []; //Array of users that don't belong to the current group.
    @observable nonGroupUsersFiltered: UserDetails[] = []; //Filtered version of the array of users that belong to the current group.
    @observable selectedUsers: UserDetails[] = []; //Array of users selected to be added or removed from the group.

    //Create a new group using the groupName observable.
    @action
    public createGroup = async (): Promise<boolean> => {

        if (this.groupName != "") {

            //Create DTO (Data Transfer Object) using custom object.
            let createGroupDetailsDTO: CreateGroupDetails = {
                groupName: this.groupName,
                userID: authStore.userID
            }

            //Call the api.
            let groupCreated: Response = await api.createGroup(createGroupDetailsDTO);

            //Check response.
            if (groupCreated) {
                return true
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    //Gets a list of all users that belong to the group of the currently logged in user.
    @action
    public getCurrentGroupUsers = async (): Promise<void> => {

        //Check permissions of current user.
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

    //Gets a list of all users that don't belong to the group of the currently logged in user.
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

    //Adds one or more users to an existing group.
    @action
    public addUsersToGroup = async (): Promise<boolean> => {
        let isTrainer = authStore.isLoggedIn && authStore.userRole == "trainer";
        let trainerHasGroup = authStore.userGroupID != 1 && authStore.userGroupID != -1 && isTrainer;

        //Generate local version of the selected users data.
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

    //Removes one or more users to an existing group.
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

    //An action to reset the observables of this store to their initial values.
    @action
    public resetStore = async (): Promise<void> => {
        this.nonGroupUsers = [];
        this.groupUsers = [];
        this.nonGroupUsersFiltered = [];
        this.groupUsersFiltered = [];
    }

    /*
     * The folowwing actions/functions handle changes to input values and/or set the value of an observable.
     */
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