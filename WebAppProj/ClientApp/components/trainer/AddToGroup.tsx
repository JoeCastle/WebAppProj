import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { TrainerStore } from '../../stores/TrainerStore/TrainerStore';
import { AuthStore } from '../../stores/AuthStore/AuthStore';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    trainerStore: TrainerStore,
    authStore: AuthStore
}

@inject('trainerStore', 'authStore')
@observer
export class AddToGroup extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
    }

    public render() {
        let isTrainer = this.props.authStore.isLoggedIn && this.props.authStore.userRole == "trainer";
        let trainerHasGroup = this.props.authStore.userGroupID != 1 && this.props.authStore.userGroupID != -1 && isTrainer;

        let loading = <div>Loading...</div>; //TODO: Create dedicated loading component, also a default my group page for undefined group, asking if they would like to create one
        return (<div className="page">
            {trainerHasGroup ? <AddToGroupPage {... this.props} /> : loading}
        </div>)
    }
}

const AddToGroupPage = (props: Props) => {
    return <div>
        <h1>This is the add to group page.</h1>
        <p>Here you can add new trainees to your existing group.</p>
    </div>
};