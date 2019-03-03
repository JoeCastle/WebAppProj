import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { QuizStore } from '../stores/QuizStore/QuizStore';
import { AuthStore } from '../stores/AuthStore/AuthStore';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    quizStore: QuizStore,
    authStore: AuthStore
}

@inject('quizStore', 'authStore')
@observer
export class ViewQuiz extends React.Component<Props> {
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
            <div className='page-header'>
                <h1>View quiz</h1>
            </div>

            <div className='page-content'>
                <form onSubmit={this.formSubmit}>
                    <div className='form-group'>
                        <label htmlFor='quizname'>Quiz name: </label>
                        <input
                            className="textbox form-control"
                            id='quizname'
                            type='text'
                            placeholder='Quiz name'
                            autoComplete='off'
                            disabled
                            value={this.props.quizStore.quizDetails.quizName}
                        />
                    </div>
                    <div className='questions-container'>{this.questions}</div>
                </form>
            </div>
        </div>;
    }

    private formSubmit = (e: any) => {
        e.preventDefault();
    }
}

const QuestionComponent = (props: any) => {
    let createChoices = () => {
        let choices = [];
        for (let i = 0; i < 4; i++) {
            choices.push(<ChoiceComponent key={i} choiceID={i} {...props} />)
        }
        return choices;
    }

    return <div className="question-component">
        <div className='question-text-container'>
            <div className='form-group'>
                <label htmlFor='questiontext'>{props.questionID + 1}. Question text: </label>
                <input
                    className="textbox form-control"
                    id='questiontext'
                    type='text'
                    placeholder='Question text'
                    autoComplete='off'
                    disabled
                    value={props.quizStore.quizDetails.questions[props.questionID].questionText}
                />
            </div>
        </div>
        <div className='choices-container'>{createChoices()}</div>
    </div>
};


const ChoiceComponent = (props: any) => {
    return <div className='choice-component' id={'group' + props.questionID}>
        <div className='choice-container'>
            <div className='form-group'>
                <label htmlFor='choicetext'>{props.questionID + 1}.{props.choiceID + 1}. Choice text: </label>
                <input
                    className='textbox form-control'
                    id='choicetext'
                    type='text'
                    placeholder='Question text'
                    autoComplete='off'
                    disabled
                    value={props.quizStore.quizDetails.questions[props.questionID].choices[props.choiceID].choiceText}
                />
            </div>
        </div>
        <div className='iscorrect-container'>
            <div className='form-group'>
                <label htmlFor='ischoicecorrect'>Is correct answer?: </label>
                <input
                    id='ischoicecorrect'
                    className='form-control'
                    type='radio'
                    name={'group' + props.questionID}
                    disabled
                    checked={props.quizStore.quizDetails.questions[props.questionID].choices[props.choiceID].isCorrect}
                />
            </div>
        </div>
    </div>
};