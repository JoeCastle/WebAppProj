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
export class StartQuiz extends React.Component<Props> {
    async componentWillMount() {
        await this.props.authStore.validateJWT();
        this.displayQuestions();
        await this.props.quizStore.getQuizByQuizID(this.props.match.params.quizID);
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
                <title>Start Quiz - Training App</title>
                <meta name='description' content='Start a quiz.' />
            </Helmet>

            <div className='page-header'>
                <h1>Start quiz</h1>
            </div>

            <div className='page-content'>
                <form onSubmit={this.formSubmit}>
                    <div className='quiz-name-container'>
                        <p>{this.props.quizStore.quizDetails.quizName}</p>
                    </div>
                    <div className='questions-container'>{this.questions}</div>
                    <button className='btn btn-primary strd-btn create-group-button'
                        onClick={
                            this.submitQuiz
                        }
                    > Submit quiz
                </button>
                </form>
            </div>
        </div>;
    }

    private formSubmit = (e: any) => {
        e.preventDefault();
    }

    private submitQuiz = async (e: any) => {
        let form = document.getElementsByTagName('form')[0];

        if (form.checkValidity()) {
            let quizSubmitted = await this.props.quizStore.submitQuiz();

            if (quizSubmitted) {
                alert("Successfully submitted quiz.");
                this.props.history.push('/viewcompletedquizzes');
            } else {
                alert("Failed to submit quiz.");
            }

            //Prevent the page from refreshing when the form is submitted
            e.preventDefault();
        } else {
            return false;
        }
    }
}

const QuestionComponent = (props: any) => {
    let createChoices = () => {
        let choices = [];
        for (let i = 0; i < 4; i++) {
            choices.push(<ChoiceComponent key={i} choiceID={i} questionID={props.questionID} {...props} />)
        }
        return choices;
    }

    return <fieldset className="question-component">
        <legend id={`legend${props.questionID}`}>Question {props.questionID + 1}.</legend>
        <div className='question-text-container'>
            <p>{props.questionID + 1}. {props.quizStore.quizDetails.questions[props.questionID].questionText}</p>
        </div>
        <div className='choices-container'>{createChoices()}</div>
    </fieldset>
};


export interface IChoiceProps {
    questionID: number;
    choiceID: number;
}

@inject('quizStore')
@observer
export class ChoiceComponent extends React.Component<IChoiceProps, IChoiceProps> {
    constructor(props: IChoiceProps) {
        super(props);

        this.state = {
            questionID: props.questionID,
            choiceID: props.choiceID,
        }
    }

    private onUserChoiceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let userChoice = e.target.value;

        quizStore.onUserChoiceChange(userChoice, this.props.questionID, this.props.choiceID);
    }

    public render() {
        return (
            <div className='choice-component' id={'group' + this.props.questionID}>
                <div className='choice-container'>
                </div>
                <div className='iscorrect-container'>
                    <div className='form-group'>
                        <label htmlFor={`userchoice${this.props.questionID}${this.props.choiceID}`}>{this.props.questionID + 1}.{this.props.choiceID + 1}. {quizStore.quizDetails.questions[this.props.questionID].choices[this.props.choiceID].choiceText} </label>
                        <input
                            id={`userchoice${this.props.questionID}${this.props.choiceID}`}
                            className='form-control'
                            type='radio'
                            name={`group${this.props.questionID}`}
                            onChange={(e) => this.onUserChoiceChange(e)}
                            checked={quizStore.userChoicesForm[this.props.choiceID + (this.props.questionID * 4)]}
                            required
                            tabIndex={0}
                            onKeyPress={(e) => { e.key == 'Enter' && e.preventDefault(); }}
                        />
                    </div>
                </div>
            </div>
        );
    }
}