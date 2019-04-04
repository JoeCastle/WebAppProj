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
        return <div className='page quiz-results-list-page'>
            <div className='page-header'>
                <h1>View quiz results by quiz</h1>
            </div>

            <div className='page-content'>
                <p>Here you can view a list of quizzes that belong to your group. Click on one of the quizzes below to view the results for trainees that have completed that quiz.</p>

                <div className='filter-container'>
                    <div className='form-group'>
                        <label htmlFor='search-input'>Search list: </label>
                        <input
                            className='form-control filter-input'
                            id='search-input'
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
                                    to={`/traineesbyquizresults/${quiz.quizID}`}
                                    key={quiz.quizID}
                                    tabIndex={0}
                                >
                                    {quiz.quizName}
                                </Link>
                            )
                        }

                        {this.props.quizStore.quizzesDetailsFiltered.length <= 0 && <div className='no-item-placeholder'>No matched quizzes were found.</div>}
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