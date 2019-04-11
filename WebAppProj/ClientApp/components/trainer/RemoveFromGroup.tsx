import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { GroupStore } from '../../stores/GroupStore/GroupStore';
import { AuthStore } from '../../stores/AuthStore/AuthStore';
import UserDetails from '../../models/userDetails';
import { action } from 'mobx';
import Helmet from 'react-helmet';

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

    componentWillUnmount() {
        this.props.groupStore.resetStore();
    }

    users = this.props.groupStore.groupUsers;
    selectedUsers: UserDetails[] = [];

    public render() {
        let isTrainer = this.props.authStore.isLoggedIn && this.props.authStore.userRole == "trainer";
        let trainerHasGroup = this.props.authStore.userGroupID != 1 && this.props.authStore.userGroupID != -1 && isTrainer;

        let loading = <div>Loading...</div>; //TODO: Create dedicated loading component, also a default my group page for undefined group, asking if they would like to create one

        return (<div className="page">
            <Helmet>
                <title>Remove from Group - Training App</title>
                <meta name='description' content='Remove a trainee from your group.' />
            </Helmet>

            <div className='page-header'>
                <h1>Remove from Group.</h1>
            </div>

            <div className='page-content'>
                <p>Here you can remove trainees from your group.</p>

                <div className='filter-container'>
                    <div className='form-group'>
                        <label htmlFor='search-input'>Search list: </label>
                        <input
                            id='search-input'
                            className='form-control filter-input'
                            placeholder='Search by UserID, Username, Firstname or Surname...'
                            onChange={this.filterList}
                        />
                    </div>
                </div>

                <div className="removeFromGroupListsContainer">
                    <div className="noGroupUsersList">
                        {
                            this.props.groupStore.groupUsersFiltered.map(
                                user => <div
                                    key={user.userID}
                                    onClick={() => this.selectUser(user)}
                                    tabIndex={0}
                                    onKeyPress={(e) => this.handleKeyPressSelect(e, user)}
                                >
                                    {user.userID} - {user.firstname} {user.surname}
                                </div>
                            )
                        }

                        {this.props.groupStore.groupUsersFiltered.length <= 0 && <div className='no-item-placeholder'>No matching users found.</div>}
                    </div>

                    <div className="selectedUsersList">
                        {
                            this.selectedUsers.map(
                                user => <div
                                    key={user.userID}
                                    onClick={() => this.unSelectUser(user)}
                                    tabIndex={0}
                                    onKeyPress={(e) => this.handleKeyPressUnselect(e, user)}
                                >
                                    {user.userID} - {user.firstname} {user.surname}
                                </div>
                            )
                        }

                        {this.selectedUsers.length <= 0 && <div className='no-item-placeholder'>No users selected. Please select one or more users.</div>}
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

    private handleKeyPressUnselect = (e: any, user: UserDetails) => {
        if (e.key == 'Enter') {
            this.unSelectUser(user);
        }
    }

    private handleKeyPressSelect = (e: any, user: UserDetails) => {
        if (e.key == 'Enter') {
            this.selectUser(user);
        }
    }

    @action
    private selectUser = async (user: UserDetails) => {
        this.selectedUsers.push(user);
        let index = this.props.groupStore.groupUsersFiltered.indexOf(user);
        this.props.groupStore.groupUsersFiltered.splice(index, 1);
    }

    @action
    private unSelectUser = async (user: UserDetails) => {
        this.props.groupStore.groupUsersFiltered.push(user);
        let index = this.selectedUsers.indexOf(user);
        this.selectedUsers.splice(index, 1);
    }

    private removeTrainees = async (e: any) => {
        this.props.groupStore.setSelectedUsers(this.selectedUsers);

        let completed = await this.props.groupStore.removeUsersFromGroup();

        if (completed) {
            this.props.history.push('/mygroup');
            alert("The users have been removed from your group.");
        } else {
            return false;
        }
    }

    @action
    private filterList = (e: React.ChangeEvent<HTMLInputElement>) => {
        let filter = e.target.value;

        this.props.groupStore.groupUsersFiltered = this.props.groupStore.groupUsers.filter((trainee) => {
            let traineeName = trainee.firstname!.toLowerCase() && trainee.surname.toLowerCase();
            let traineeFirstname = trainee.firstname!.toLowerCase();
            let traineeSurname = trainee.surname.toLowerCase();
            let traineeID = trainee.userID.toString().toLowerCase();
            let traineeUsername = trainee.username!.toLowerCase();

            for (let selectedUser in this.selectedUsers) {
                if (this.selectedUsers[selectedUser] == trainee) {
                    return false;
                }
            }

            return (
                traineeName.lastIndexOf(filter.toLowerCase()) !== -1 ||
                traineeFirstname.lastIndexOf(filter.toLowerCase()) !== -1 ||
                traineeSurname.lastIndexOf(filter.toLowerCase()) !== -1 ||
                traineeID.toString().lastIndexOf(filter.toLowerCase()) !== -1 ||
                traineeUsername.toString().lastIndexOf(filter.toLowerCase()) !== -1
            )
        })
    }
}