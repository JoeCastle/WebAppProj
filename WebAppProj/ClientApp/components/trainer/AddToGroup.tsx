import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { GroupStore } from '../../stores/GroupStore/GroupStore';
import { AuthStore } from '../../stores/AuthStore/AuthStore';
import UserDetails from '../../models/userDetails';

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

        console.log(this.props.groupStore.nonGroupUsers);

        debugger;
    }

    public render() {
        let isTrainer = this.props.authStore.isLoggedIn && this.props.authStore.userRole == "trainer";
        let trainerHasGroup = this.props.authStore.userGroupID != 1 && this.props.authStore.userGroupID != -1 && isTrainer;

        //TODO: Value is being returned as object containing array of arrays
        let users = this.props.groupStore.nonGroupUsers;

        let todos = this.props.groupStore.todos;

        debugger;

        let loading = <div>Loading...</div>; //TODO: Create dedicated loading component, also a default my group page for undefined group, asking if they would like to create one
        return (<div className="page">
            {trainerHasGroup ? <AddToGroupPage {... this.props} /> : loading}
            <div>
                {
                    users.map(
                        user => <div key={user.userID}>{user.firstname}, {user.surname}</div>
                    )
                }
            </div>
        </div>)
    }
}

const AddToGroupPage = (props: Props) => {
    //let users = props.groupStore.nonGroupUsers;
    return <div>
        <h1>This is the add to group page.</h1>
        <p>Here you can add new trainees to your existing group.</p>

        {/*<div>
            {
                users.map(
                    user => <div>{user.user.firstname}, {user.user.surname}</div>
                )
            }
        </div>*/}
    </div>
};