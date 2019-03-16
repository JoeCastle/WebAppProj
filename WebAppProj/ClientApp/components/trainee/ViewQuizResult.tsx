import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import quizStore, { QuizStore } from '../../stores/QuizStore/QuizStore';
import { AuthStore } from '../../stores/AuthStore/AuthStore';

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
            <div className='page-header'>
                <h1>View quiz results</h1>
            </div>

            <div className='page-content'>
                <form>
                    <div className='quiz-name-container'>
                        <p>{this.props.quizStore.quizResults.quizName}</p>
                    </div>
                    <div className='questions-container'>{this.questions}</div>
                </form>
            </div>
        </div>;
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

    return <div className="question-component">
        <div className='question-text-container'>
            <p>{props.questionID + 1}. {props.quizStore.quizResults.questions[props.questionID].questionText}</p>
        </div>
        <div className='choices-container'>{createChoices()}</div>
    </div>
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
                        <label htmlFor={`userchoice${this.props.questionID}${this.props.choiceID}`}>{this.props.questionID + 1}.{this.props.choiceID + 1}. {quizStore.quizResults.questions[this.props.questionID].choices[this.props.choiceID].choiceText} </label>
                        <input
                            id={`userchoice${this.props.questionID}${this.props.choiceID}`}
                            className='form-control'
                            type='radio'
                            name={`group${this.props.questionID}`}
                            onChange={(e) => this.onUserChoiceChange(e)}
                            checked={quizStore.userChoicesForm[this.props.choiceID + (this.props.questionID * 4)]}
                            required
                        />
                    </div>
                </div>
            </div>
        );
    }
}