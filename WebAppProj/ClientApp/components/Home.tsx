import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';
import { Helmet } from "react-helmet";

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
        <Helmet>
            <title>Home - Training App</title>
            <meta name='description' content='Home page and landing point for logged out users.' />
        </Helmet>

        <p>You are <b>not</b> logged in.</p>

        <br />

        <p>If you login or register, you will be able to do the following:</p>
        <p>As a trainer you are able to:</p>
        <ul>
            <li>Create a group.</li>
            <li>Add users to and remove users from your group.</li>
            <li>View users in your group.</li>
            <li>Create quizzes that trainees in your group can take.</li>
            <li>View old quizzes you have created.</li>
            <li>View the quiz results of trainees in your group.</li>
            <li>Toggle on/off the high contrast theme.</li>
        </ul>

        <br/>

        <p>As a trainee, assuming you are in a group, you are able to:</p>
        <ul>
            <li>Complete quizzes.</li>
            <li>View results for completed quizzes.</li>
            <li>Toggle on/off the high contrast theme.</li>
        </ul>

        <br />

        <p>However, you are always able to toggle on/off the high contrast theme regardless of whether you are logged in or not.</p>
    </div>
};

const TrainerHome = (props: Props) => {
    return <div className='page-content'>
        <Helmet>
            <title>Trainer Home - Training App</title>
            <meta name='description' content='Home page and landing point for trainers.' />
        </Helmet>

        <p>Trainer home, welcome {props.authStore.username}</p>

        <p>As a trainer you are able to:</p>
        <ul>
            <li>Create a group.</li>
            <li>Add users to and remove users from your group.</li>
            <li>View users in your group.</li>
            <li>Create quizzes that trainees in your group can take.</li>
            <li>View old quizzes you have created.</li>
            <li>View the quiz results of trainees in your group.</li>
            <li>Toggle on/off the high contrast theme.</li>
        </ul>
    </div>
};

const TraineeHome = (props: Props) => {
    return <div className='page-content'>
        <Helmet>
            <title>Trainee Home - Training App</title>
            <meta name='description' content='Home page and landing point for trainees.' />
        </Helmet>

        <p>Trainee home, welcome {props.authStore.username}</p>

        <p>As a trainee, assuming you are in a group, you are able to:</p>
        <ul>
            <li>Complete quizzes.</li>
            <li>View results for completed quizzes.</li>
            <li>Toggle on/off the high contrast theme.</li>
        </ul>
    </div>
};
