import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import traineeStore, { TraineeStore } from '../stores/TraineeStore/TraineeStore';
//import * as stores from '../stores/index';
//import { authStore } from '../stores/index';
import { inject, observer } from 'mobx-react';

//https://github.com/mhaagens/react-mobx-react-router4-boilerplate/issues/29
//https://redux-form.com/6.7.0/docs/faq/handlevson.md/

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore,
    traineeStore: TraineeStore
}

@inject('authStore', 'traineeStore')
@observer
export class TraineeHome extends React.Component<Props> {
    public render() {
        return <div className="page">
            <h1>Hello, trainee!</h1>
            <p>This is the trainee home.</p>
            <button
                onClick={
                    this.traineeTest
                }
            >
                TraineeTest
            </button>
        </div>;
    }

    private traineeTest = () => {
        this.props.traineeStore.traineeTest();
    }
}