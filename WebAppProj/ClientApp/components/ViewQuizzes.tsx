import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import quizStore, { QuizStore } from '../stores/QuizStore/QuizStore';
import { action } from 'mobx';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

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
        return <div className='page view-quizzes-page'>
            <Helmet>
                <title>View Quizzes List - Training App</title>
                <meta name='description' content='View a list of past quizzes you have created.' />
            </Helmet>

            <div className='page-header'>
                <h1>View quizzes</h1>
            </div>

            <div className='page-content'>
                <p>Here you can view a list of quizzes that belong to your group.</p>

                <div className='filter-container'>
                    <div className='form-group'>
                        <label htmlFor='search-input'>Search list: </label>
                        <input
                            id='search-input'
                            className='form-control filter-input'
                            placeholder='Search by QuizID or Quiz name...'
                            onChange={this.filterList}
                        />
                    </div>
                </div>

                <div className="quiz-list-container">
                    <div className="quiz-list">
                        {
                            this.props.quizStore.quizzesDetailsFiltered.map(
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

                        {this.props.quizStore.quizzesDetailsFiltered.length <= 0 && <div className='no-item-placeholder'>No matching quizzes found.</div>}
                    </div>
                </div>
            </div>
        </div>;
    }

    @action
    private filterList = (e: React.ChangeEvent<HTMLInputElement>) => {
        let filter = e.target.value;

        this.props.quizStore.quizzesDetailsFiltered = this.props.quizStore.quizzesDetails.filter((quiz) => {
            let quizName = quiz.quizName!.toLowerCase();
            let quizID = quiz.quizID!.toString().toLowerCase();
            return (
                quizName.lastIndexOf(filter.toLowerCase()) !== -1 ||
                quizID.lastIndexOf(filter.toLowerCase()) !== -1
            )
        })
    }
};