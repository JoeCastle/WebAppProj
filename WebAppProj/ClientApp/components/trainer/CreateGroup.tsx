import * as React from 'react';
import { RouteComponentProps } from 'react-router';
//import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    //authStore: AuthStore
}

//@inject('authStore')
//@observer
export class CreateGroup extends React.Component<Props> {
    public render() {
        return <div className="page">
            <h1>This is the create group page.</h1>
            <p>Create a group.</p>
            
        </div>;
    }
}
