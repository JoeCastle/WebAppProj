import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import quizStore, { QuizStore } from '../../stores/QuizStore/QuizStore';
import { AuthStore } from '../../stores/AuthStore/AuthStore';
import Helmet from 'react-helmet';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    quizStore: QuizStore,
    authStore: AuthStore
}

@inject('quizStore', 'authStore')
@observer
export class ViewQuizResult extends React.Component<Props> {
    async componentWillMount() {
        await this.props.authStore.validateJWT();
        this.displayQuestions();
        await this.props.quizStore.getQuizResults(this.props.match.params.quizID);
    }

    questions: JSX.Element[] = [];

    displayQuestions = () => {
        for (let i = 0; i < 5; i++) {
            this.questions.push(<QuestionComponent key={i} questionID={i} {... this.props} />)
        }
    }

    public render() {
        return <div className="page">
            <Helmet>
                <title>Quiz Result - Training App</title>
                <meta name='description' content='The results for a specific quiz.' />
            </Helmet>

            <div className='page-header'>
                <h1>View quiz results</h1>
            </div>

            <div className='page-content'>
                <form>
                    <div className='quiz-name-container'>
                        <p>{this.props.quizStore.quizResults.quizName}</p>
                    </div>
                    <div className='questions-container'>{this.questions}</div>
                    <div className='single-quiz-result'><b>Total: {this.props.quizStore.quizTotal}/5</b></div>
                    <div className='single-quiz-result'><b>Score: {this.props.quizStore.quizTotal / 5 * 100}%</b></div>
                </form>
            </div>
        </div>;
    }
}

export interface IQuestionProps {
    questionID: number;
}

@inject('quizStore')
@observer
export class QuestionComponent extends React.Component<IQuestionProps, IQuestionProps> {
    constructor(props: IQuestionProps) {
        super(props);

        this.state = {
            questionID: props.questionID
        }
    }

    public render() {
        return <div className="question-component">
            <div className='question-text-container'>
                <p>{this.props.questionID + 1}. {quizStore.quizResults.questions[this.props.questionID].questionText}</p>
                <p>Result: <b>{quizStore.quizResults.questions[this.props.questionID].result == 1 ? 'Correct' : 'Incorrect'}</b></p>
            </div>
        </div>;
    }
}