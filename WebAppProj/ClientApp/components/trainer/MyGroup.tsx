import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { TrainerStore } from '../../stores/TrainerStore/TrainerStore';
import { AuthStore } from '../../stores/AuthStore/AuthStore';
import { GroupStore } from '../../stores/GroupStore/GroupStore';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    trainerStore: TrainerStore,
    authStore: AuthStore,
    groupStore: GroupStore
}

@inject('trainerStore', 'authStore', 'groupStore')
@observer
export class MyGroup extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.groupStore.getCurrentGroupUsers();
    }

    public render() {
        let loading = <div>Loading...</div>; //TODO: Create dedicated loading component, also a default my group page for undefined group, asking if they would like to create one
        return (<div className='page my-group-page'>

            {/*{this.props.authStore.userGroupID == 1 ? loading : <MyGroupPage {... this.props} />} {/*Conditional render*/}
            {/*{this.props.authStore.userGroupID == 1 && loading}*/}

            <div className='page-header'>
                <h1>My Group</h1>
            </div>
            <div className='page-content'>
                <p>View trainees assigned to your group:</p>
                <p>Your group id is: {this.props.authStore.userGroupID}</p>

                <div className="noGroupUsersList">
                    {
                        this.props.groupStore.groupUsers.map(
                            user => <div
                                key={user.userID}
                            >
                                {user.userID} - {user.firstname} {user.surname}
                            </div>
                        )
                    }

                    {this.props.groupStore.groupUsers.length <= 0 && <div>There are no trainees in your group.</div>}
                </div>
            </div>
        </div>)
    }
}

//const MyGroupPage = (props: Props) => {
//    return <div>
//        <div className='page-header'>
//            <h1>My Group</h1>
//        </div>
//        <div className='page-content'>
//            <p>View trainees assigned to your group:</p>
//            <p>Your group id is: {props.authStore.userGroupID}</p>

//            <div className="noGroupUsersList">
//                {
//                    props.groupStore.groupUsers.map(
//                        user => <div
//                            key={user.userID}
//                        >
//                            {user.userID} - {user.firstname} {user.surname}
//                        </div>
//                    )
//                }

//                {props.groupStore.groupUsers.length <= 0 && <div>There are no trainees in your group.</div>}
//            </div>
//        </div>
//    </div>
//};