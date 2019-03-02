import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import quizStore, { QuizStore } from '../stores/QuizStore/QuizStore';
import { action } from 'mobx';
import QuizDetails from '../models/GetQuiz/quizDetails';
import { AuthStore } from '../stores/AuthStore/AuthStore';

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
                <div className="addToGroupListsContainer">
                    <div className="noGroupUsersList">
                        {
                            this.quizzes.map(
                                quiz => <div
                                    key={quiz.quizID}
                                    //onClick={() => this.selectQuiz(quiz)}
                                    tabIndex={0}
                                >
                                    {quiz.quizID} - {quiz.quizName}
                                </div>
                            )
                        }

                        {!this.quizzes && <div>No users</div>}
                    </div>
                </div>
            </div>
        </div>;
    }

    //@action
    //private selectUser = async (quiz: QuizDetails) => {
    //    this.selectedUsers.push(user);
    //    let index = this.users.indexOf(user);
    //    this.users.splice(index, 1);
    //}
};