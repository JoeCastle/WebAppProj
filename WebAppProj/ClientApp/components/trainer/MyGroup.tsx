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
export class MyGroup extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
    }

    public render() {
        let loading = <div>Loading...</div>; //TODO: Create dedicated loading component, also a default my group page for undefined group, asking if they would like to create one
        return (<div className="page">

            {this.props.authStore.userGroupID == 1 ? loading : <MyGroupPage {... this.props} />} {/*Conditional render*/}
            {/*{this.props.authStore.userGroupID == 1 && loading}*/}
        </div>)
    }
}

const MyGroupPage = (props: Props) => {
    return <div>
        <h1>My Group.</h1>
        <p>View your group.</p>
        <p>Your group id is: {props.authStore.userGroupID}</p>
    </div>
};