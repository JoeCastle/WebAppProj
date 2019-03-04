import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { QuizStore } from '../../stores/QuizStore/QuizStore';
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
        let quizCreated = await this.props.quizStore.createQuiz();

        //Prevent the page from refreshing when the form is submitted
        e.preventDefault();

        if (quizCreated) {
            //this.props.history.push('/mygroup');
            alert("Successfully created quiz.");
        } else {
            alert("Failed to create quiz.");
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
            choices.push(<ChoiceComponent key={i} choiceID={i} {...props} />)
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
                />
            </div>
        </div>
        <div className='choices-container'>{createChoices()}</div>
    </div>
};


const ChoiceComponent = (props: any) => {
    let onChoiceTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let choiceText = e.target.value;

        props.quizStore.onChoiceTextChange(choiceText, props.questionID, props.choiceID);
    }

    let onChoiceIsCorrectChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let isChoiceCorrect = e.target.value;

        await props.quizStore.onChoiceIsCorrectChange(isChoiceCorrect, props.questionID, props.choiceID);
    }

    return <div className='choice-component' id={'group' + props.questionID}>
        <div className='choice-container'>
            <div className='form-group'>
                <label htmlFor={`choicetext${props.questionID}${props.choiceID}`}>{props.questionID + 1}.{props.choiceID + 1}. Choice text: </label>
                <input
                    className='textbox form-control'
                    id={`choicetext${props.questionID}${props.choiceID}`}
                    type='text'
                    placeholder='Question text'
                    autoComplete='off'
                    required
                    onChange={onChoiceTextChange}
                />
            </div>
        </div>
        <div className='iscorrect-container'>
            <div className='form-group'>
                <label htmlFor={`ischoicecorrect${props.questionID}${props.choiceID}`}>Is correct answer?: </label>
                <input
                    id={`ischoicecorrect${props.questionID}${props.choiceID}`}
                    className='form-control'
                    type='radio'
                    name={`group${props.questionID}`}
                    onChange={onChoiceIsCorrectChange}
                    required
                />
            </div>
        </div>
    </div>
};