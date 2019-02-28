import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { GroupStore } from '../../stores/GroupStore/GroupStore';
import { AuthStore } from '../../stores/AuthStore/AuthStore';
import UserDetails from '../../models/userDetails';
import { action } from 'mobx';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    groupStore: GroupStore,
    authStore: AuthStore
}

@inject('groupStore', 'authStore')
@observer
export class AddToGroup extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.groupStore.getUsersNotInGroup();
    }

    users = this.props.groupStore.nonGroupUsers;
    selectedUsers: UserDetails[] = [];

    public render() {
        let isTrainer = this.props.authStore.isLoggedIn && this.props.authStore.userRole == "trainer";
        let trainerHasGroup = this.props.authStore.userGroupID != 1 && this.props.authStore.userGroupID != -1 && isTrainer;

        let loading = <div>Loading...</div>; //TODO: Create dedicated loading component, also a default my group page for undefined group, asking if they would like to create one
        return (<div className="page">
            {/*{trainerHasGroup ? <AddToGroupPage {... this.props} /> : loading}*/}
            <div className='page-header'>
                <h1>Add to Group.</h1>
            </div>

            <div className='page-content'>
                <p>Here you can add new trainees to your existing group.</p>
                <div className="addToGroupListsContainer">
                    <div className="noGroupUsersList">
                        {
                            this.users.map(
                                user => <div
                                    key={user.userID}
                                    onClick={() => this.selectUser(user)}
                                >
                                    {user.userID} - {user.firstname} {user.surname}
                                </div>
                            )
                        }

                        {!this.users && <div>No users</div>}
                    </div>

                    <div className="selectedUsersList">
                        {
                            this.selectedUsers.map(
                                user => <div
                                    key={user.userID}
                                    onClick={() => this.unSelectUser(user)}
                                >
                                    {user.userID} - {user.firstname} {user.surname}
                                </div>
                            )
                        }

                        {!this.users && <div>No users</div>}
                    </div>
                </div>

                <button className="btn btn-primary strd-btn"
                    onClick={
                        this.addTrainees
                    }
                >
                    Add trainees to group
            </button>
            </div>
        </div>)
    }

    @action
    private selectUser = async (user: UserDetails) => {
        this.selectedUsers.push(user);
        let index = this.users.indexOf(user);
        this.users.splice(index, 1);
    }

    @action
    private unSelectUser = async (user: UserDetails) => {
        this.users.push(user);
        let index = this.selectedUsers.indexOf(user);
        this.selectedUsers.splice(index, 1);
    }

    private addTrainees = async (e: any) => {
        this.props.groupStore.setSelectedUsers(this.selectedUsers);

        let completed = await this.props.groupStore.addUsersToGroup();

        if (completed) {
            this.props.history.push('/');
            alert("The users have been added to your group.");
        } else {
            //display error, move to store, have error observable
            return false;
        }
    }
}
