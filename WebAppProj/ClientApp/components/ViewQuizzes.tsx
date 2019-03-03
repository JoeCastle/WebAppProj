import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import quizStore, { QuizStore } from '../stores/QuizStore/QuizStore';
import { action } from 'mobx';
import QuizDetails from '../models/GetQuiz/quizDetails';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { Link } from 'react-router-dom';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    quizStore: QuizStore,
    authStore: AuthStore
}

@inject('quizStore', 'authStore')
@observer
export class ViewQuizzes extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.quizStore.getAllQuizzesforGroup();
    }

    quizzes = this.props.quizStore.quizzesDetails;

    public render() {
        return <div className="page">
            <div className='page-header'>
                <h1>View quizzes</h1>
            </div>

            <div className='page-content'>
                <p>Here you can view a list of quizzes that belong to your group.</p>
                <div className="quiz-list-container">
                    <div className="quiz-list">
                        {
                            this.quizzes.map(
                                quiz => <Link
                                        className="quiz"
                                        to={`/viewquiz/${quiz.quizID}`}
                                        key={quiz.quizID}
                                        tabIndex={0}
                                    >
                                        {quiz.quizName}
                                    </Link>
                            )
                        }

                        {!this.quizzes && <div>No quizzes</div>}
                    </div>
                </div>
            </div>
        </div>;
    }
};