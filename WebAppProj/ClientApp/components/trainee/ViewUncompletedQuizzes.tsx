import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import quizStore, { QuizStore } from '../../stores/QuizStore/QuizStore';
import { action } from 'mobx';
import QuizDetails from '../../models/GetQuiz/quizDetails';
import { AuthStore } from '../../stores/AuthStore/AuthStore';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    quizStore: QuizStore,
    authStore: AuthStore
}

@inject('quizStore', 'authStore')
@observer
export class ViewUncompleteQuizzes extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.quizStore.getUncompletedQuizzesForTrainee();
    }

    componentWillUnmount() {
        this.props.quizStore.resetStore();
    }

    quizzes = this.props.quizStore.quizzesDetails;

    public render() {
        return <div className="page">
            <Helmet>
                <title>Uncompleted Quizzes - Training App</title>
                <meta name='description' content='List of quizzes that you have not completed and therefore are able to complete.' />
            </Helmet>

            <div className='page-header'>
                <h1>View uncompleted quizzes</h1>
            </div>

            <div className='page-content'>
                {this.quizzes.length > 0 ?
                    <p>Here you can view a list of quizzes that you have not completed. Click on one to start the quiz.</p>
                    : <div className='empty-list-message'>You have no uncompleted quizzes.</div>
                }
                <div className="quiz-list-container">
                    <div className="quiz-list">
                        {
                            this.quizzes.map(
                                quiz => <Link
                                    className="quiz"
                                    to={`/startquiz/${quiz.quizID}`}
                                    key={quiz.quizID}
                                    tabIndex={0}
                                >
                                    {quiz.quizName}
                                </Link>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>;
    }
};