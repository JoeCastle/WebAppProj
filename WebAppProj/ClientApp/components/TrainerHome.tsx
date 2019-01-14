import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
export class TrainerHome extends React.Component<Props> {
    public render() {
        return <div className="page">
            <h1>Hello, trainer!</h1>
            <p>This is the trainer home.</p>
            <button
                onClick={
                    this.logout
                }
            >
                Logout
            </button>
        </div>;
    }

    private logout = () => {
        this.props.authStore.logout();
    }
}
