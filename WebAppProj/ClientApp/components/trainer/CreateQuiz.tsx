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
export class CreateQuiz extends React.Component<Props> {
    async componentWillMount() {
        this.createQuestions();
        await this.props.authStore.validateJWT();
    }

    questions: JSX.Element[] = [];

    createQuestions = () => {
        for (let i = 0; i < 5; i++) {
            this.questions.push(<QuestionComponent key={i} questionID={i} {... this.props} />)
        }
    }

    public render() {
        return <div className="page">
            <div className='page-header'>
                <h1>Create a Quiz.</h1>
            </div>

            <div className='page-content'>
                <form onSubmit={this.formSubmit}>
                    <div className='form-group quiz-name-container'>
                        <label htmlFor='quizname'>Quiz name: </label>
                        <input
                            className='textbox form-control'
                            id='quizname'
                            type='text'
                            placeholder='Quiz name'
                            autoComplete='off'
                            required
                            onChange={this.onQuizNameChange}
                            onKeyPress={(e) => { e.key == 'Enter' && e.preventDefault(); }}
                        />
                    </div>
                    <div className='questions-container'>{this.questions}</div>

                    <button className='btn btn-primary strd-btn create-group-button'
                        onClick={
                            this.createQuiz
                        }
                    > Create quiz
                </button>
                </form>
            </div>
        </div>;
    }

    private formSubmit = (e: any) => {
        e.preventDefault();
    }

    private createQuiz = async (e: any) => {
        let form = document.getElementsByTagName('form')[0];

        if (form.checkValidity()) {
            let quizCreated = await this.props.quizStore.createQuiz();

            if (quizCreated) {
                //this.props.history.push('/mygroup');
                alert("Successfully created quiz.");
                this.props.history.push('/viewquizzes');
            } else {
                alert("Failed to create quiz.");
            }

            //Prevent the page from refreshing when the form is submitted
            e.preventDefault();
        } else {
            return false;
        }
    }

    private onQuizNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let quizName = e.target.value;

        this.props.quizStore.onQuizNameChange(quizName);
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

    let onQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let questionText = e.target.value;

        props.quizStore.onQuestionTextChange(questionText, props.questionID);
    }

    return <div className="question-component">
        <div className='question-text-container'>
            <div className='form-group'>
                <label htmlFor={`questiontext${props.questionID}`}>{props.questionID + 1}. Question text: </label>
                <input
                    className='textbox form-control'
                    id={`questiontext${props.questionID}`}
                    type='text'
                    placeholder='Question text'
                    autoComplete='off'
                    required
                    onChange={onQuestionTextChange}
                    onKeyPress={(e) => { e.key == 'Enter' && e.preventDefault(); }}
                />
            </div>
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

    private onChoiceTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let choiceText = e.target.value;

        quizStore.onChoiceTextChange(choiceText, this.props.questionID, this.props.choiceID);
    }

    private onChoiceIsCorrectChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let isChoiceCorrect = e.target.value;

        await quizStore.onChoiceIsCorrectChange(isChoiceCorrect, this.props.questionID, this.props.choiceID);
    }

    public render() {
        return (
            <div className='choice-component' id={'group' + this.props.questionID}>
                <div className='choice-container'>
                    <div className='form-group'>
                        <label htmlFor={`choicetext${this.props.questionID}${this.props.choiceID}`}>{this.props.questionID + 1}.{this.props.choiceID + 1}. Choice text: </label>
                        <input
                            className='textbox form-control'
                            id={`choicetext${this.props.questionID}${this.props.choiceID}`}
                            type='text'
                            placeholder='Question text'
                            autoComplete='off'
                            required
                            onChange={this.onChoiceTextChange}
                            tabIndex={0}
                            onKeyPress={(e) => { e.key == 'Enter' && e.preventDefault(); }}
                        />
                    </div>
                </div>
                <div className='iscorrect-container'>
                    <div className='form-group'>
                        <label htmlFor={`ischoicecorrect${this.props.questionID}${this.props.choiceID}`}>Is correct answer?: </label>
                        <input
                            id={`ischoicecorrect${this.props.questionID}${this.props.choiceID}`}
                            className='form-control'
                            type='radio'
                            name={`group${this.props.questionID}`}
                            onChange={(e) => this.onChoiceIsCorrectChange(e)}
                            checked={quizStore.choicesCorrect[this.props.choiceID + (this.props.questionID * 4)]}
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