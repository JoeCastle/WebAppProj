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
export class RemoveFromGroup extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.groupStore.getCurrentGroupUsers();
    }

    users = this.props.groupStore.groupUsers;
    selectedUsers: UserDetails[] = [];

    public render() {
        let isTrainer = this.props.authStore.isLoggedIn && this.props.authStore.userRole == "trainer";
        let trainerHasGroup = this.props.authStore.userGroupID != 1 && this.props.authStore.userGroupID != -1 && isTrainer;

        let loading = <div>Loading...</div>; //TODO: Create dedicated loading component, also a default my group page for undefined group, asking if they would like to create one

        return (<div className="page">
            {/*{trainerHasGroup ? <RemoveFromGroupPage {... this.props} /> : loading}*/}
            <div className='page-header'>
                <h1>Remove from Group.</h1>
            </div>
            <div className='page-content'>
                <p>Here you can remove trainees from your group.</p>
                <div className="removeFromGroupListsContainer">
                    <div className="noGroupUsersList">
                        {
                            this.users.map(
                                user => <div
                                    key={user.userID}
                                    onClick={() => this.selectUser(user)}
                                    tabIndex={0}
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
                                    tabIndex={0}
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
                        this.removeTrainees
                    }
                >
                    Remove trainees from group
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

    private removeTrainees = async (e: any) => {
        this.props.groupStore.setSelectedUsers(this.selectedUsers);

        let completed = await this.props.groupStore.removeUsersFromGroup();

        if (completed) {
            this.props.history.push('/');
            alert("The users have been removed from your group.");
        } else {
            //display error, move to store, have error observable
            return false;
        }
    }
}

const RemoveFromGroupPage = (props: Props) => {
    return <div>

    </div>
};