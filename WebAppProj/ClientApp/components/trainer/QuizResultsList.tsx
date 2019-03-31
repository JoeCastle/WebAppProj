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
export class QuizResultList extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.quizStore.getAllQuizzesforGroup();
    }

    quizzes = this.props.quizStore.quizzesDetails;

    public render() {
        return <div className="page">
            <div className='page-header'>
                <h1>View quiz results by quiz</h1>
            </div>

            <div className='page-content'>
                <p>Here you can view a list of quizzes that belong to your group. Click on one of the quizzes below to view the results for trainees that have completed that quiz.</p>
                <div className="quiz-list-container">
                    <div className="quiz-list">
                        {
                            this.quizzes.map(
                                quiz => <Link
                                    className="quiz"
                                    to={`/traineesbyquizresults/${quiz.quizID}`}
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