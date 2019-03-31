import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import { Link } from 'react-router-dom';
import { ResultStore } from '../../stores/ResultsStore/ResultsStore';
import { AuthStore } from '../../stores/AuthStore/AuthStore';
import { QuizStore } from '../../stores/QuizStore/QuizStore';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    quizStore: QuizStore,
    authStore: AuthStore,
    resultStore: ResultStore
}

@inject('quizStore', 'authStore', 'resultStore')
@observer
export class TraineesByQuizResults extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.resultStore.getTraineesResultsByQuizID(this.props.match.params.quizID);
    }

    trainees = this.props.resultStore.traineesByQuiz;

    public render() {
        return <div className="page">
            <div className='page-header'>
                <h1>List of trainees who have completed this quiz, with their results.</h1>
            </div>

            <div className='page-content'>
                <p>Here you can view a list of quizzes that belong to your group. Click on one of the quizzes below to view the results for trainees that have completed that quiz.</p>

                <div className="addToGroupListsContainer">
                    <div className="noGroupUsersList">
                        {
                            this.trainees.map(
                                trainee => <div
                                    key={trainee.userID}
                                    //onClick={() => this.selectUser(user)}
                                >
                                    {trainee.userID} - {trainee.firstname} {trainee.surname} : Score {trainee.result}
                                </div>
                            )
                        }

                        {!this.trainees && <div>No trainees have completed this quiz.</div>}
                    </div>
                </div>
            </div>
        </div>;
    }
};