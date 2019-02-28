import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
export class Home extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
    }

    public render() {
        return (<div className="page">
            <div className='page-header'>
                <h1>Home</h1>
            </div>
            {
                this.props.authStore.userRole == "trainer" &&
                <TrainerHome {... this.props} />
            }
            {
                this.props.authStore.userRole == "trainee" &&
                <TraineeHome {... this.props} />
            }
            {
                this.props.authStore.userRole == "" &&
                <StandardHome {... this.props} />
            }
        </div>)
    }
}

//Functional components
const StandardHome = (props: Props) => {
    return <div className='page-content'>
        You are not logged in.
    </div>
};

const TrainerHome = (props: Props) => {
    return <div className='page-content'>
        Trainer home, welcome {props.authStore.username}
    </div>
};

const TraineeHome = (props: Props) => {
    return <div className='page-content'>
        Trainee home, welcome {props.authStore.username}
    </div>
};
