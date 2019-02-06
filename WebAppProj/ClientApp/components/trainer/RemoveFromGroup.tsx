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
export class RemoveFromGroup extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
    }

    public render() {
        let isTrainer = this.props.authStore.isLoggedIn && this.props.authStore.userRole == "trainer";
        let trainerHasGroup = this.props.authStore.userGroupID != 1 && this.props.authStore.userGroupID != -1 && isTrainer;

        let loading = <div>Loading...</div>; //TODO: Create dedicated loading component, also a default my group page for undefined group, asking if they would like to create one
        return (<div className="page">
            {trainerHasGroup ? <RemoveFromGroupPage {... this.props} /> : loading}
        </div>)
    }
}

const RemoveFromGroupPage = (props: Props) => {
    return <div>
        <h1>This is the remove from group page.</h1>
        <p>Here you can remove trainees from your group.</p>
    </div>
};