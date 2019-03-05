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
        let quizSubmitted = await this.props.quizStore.submitQuiz();

        //Prevent the page from refreshing when the form is submitted
        e.preventDefault();

        if (quizSubmitted) {
            //this.props.history.push('/mygroup');
            alert("Successfully created quiz.");
        } else {
            alert("Failed to create quiz.");
        }
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
            <p>{props.questionID + 1}. {props.quizStore.quizDetails.questions[props.questionID].questionText}</p>
        </div>
        <div className='choices-container'>{createChoices()}</div>
    </div>
};


const ChoiceComponent = (props: any) => {
    let onUserChoiceChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        let userChoice = e.target.value;
        //debugger;
        isChecked();
        props.quizStore.onUserChoiceChange(userChoice, props.questionID, props.choiceID);
    }

    let isChecked = () => {
        let index = props.choiceID + (props.questionID * 4);

        //debugger;

        //for (let activeIndex in quizStore.activeRadioIndexes) {
        //    if (activeIndex == index) {
        //        active = true;
        //        break;
        //    }
        //}

        //var test = quizStore.activeRadioIndexes;

        //The old active value needs to be removed.
        if (quizStore.activeRadioIndexes.indexOf(index)) {
            console.log(quizStore.activeRadioIndexes.indexOf(index))
            active = true;
            debugger;
        } else {
            active = false;
            debugger;
        }
    }

    let active;

    let index = props.choiceID + (props.questionID * 4);

    return <div className='choice-component' id={'group' + props.questionID}>
        <div className='choice-container'>
        </div>
        <div className='iscorrect-container'>
            <div className='form-group'>
                <label htmlFor={`ischoicecorrect${props.questionID}${props.choiceID}`}>{props.questionID + 1}.{props.choiceID + 1}. {props.quizStore.quizDetails.questions[props.questionID].choices[props.choiceID].choiceText} </label>
                <input
                    id={`ischoicecorrect${props.questionID}${props.choiceID}`}
                    className='form-control'
                    type='radio'
                    name={`group${props.questionID}`}
                    onChange={onUserChoiceChange}
                    checked={active}
                    required
                />
            </div>
        </div>
    </div>
};