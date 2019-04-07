import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { AuthStore } from '../../stores/AuthStore/AuthStore';
import { GroupStore } from '../../stores/GroupStore/GroupStore';
import Helmet from 'react-helmet';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore,
    groupStore: GroupStore
}

@inject('authStore', 'groupStore')
@observer
export class MyGroup extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.groupStore.getCurrentGroupUsers();
    }

    public render() {
        let loading = <div>Loading...</div>; //TODO: Create dedicated loading component, also a default my group page for undefined group, asking if they would like to create one
        return (<div className='page my-group-page'>

            <Helmet>
                <title>My Group - Training App</title>
                <meta name='description' content='View a list of trainees in your group.' />
            </Helmet>

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

                    {this.props.groupStore.groupUsers.length <= 0 && <div className='no-item-placeholder'>There are no trainees in your group.</div>}
                </div>
            </div>
        </div>)
    }
}