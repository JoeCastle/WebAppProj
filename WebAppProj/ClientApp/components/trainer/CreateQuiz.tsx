import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { QuizStore } from '../../stores/QuizStore/QuizStore';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    quizStore: QuizStore
}

//Maybe do one question per page?
@inject('quizStore')
@observer
export class CreateQuiz extends React.Component<Props> {
    componentWillMount() {
        this.createQuestions();
    }

    questions: JSX.Element[] = [];

    createQuestions = () => {
        //let questions = [];
        for (let i = 0; i < 5; i++) {
            this.questions.push(<QuestionComponent {... this.props} />)
        }
    }

    public render() {
        return <div className="page">
            <h1>This is the create quiz page.</h1>
            <p>Create a quiz.</p>
            
            <form onSubmit={this.formSubmit}>
                <label htmlFor='quizname'>Quiz name: </label>
                <input
                    className="textbox"
                    id='quizname'
                    type='text'
                    placeholder='Quiz name'
                    autoComplete='off'
                    required
                    //onChange={}

                />

                {this.questions}

                <button className='btn btn-primary strd-btn create-group-button'
                    onClick={
                        this.createQuiz
                    }
                > Create group
                </button>
            </form>
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
            alert("Your group has been created.");
        } else {
            return false;
        }
    }
}

const QuestionComponent = (props: Props) => {
    let createChoices = () => {
        let choices = [];
        for (let i = 0; i < 4; i++) {
            choices.push(<ChoiceComponent {...props} />)
        }
        return choices;
    }

    return <div className="question-component">
        <label htmlFor='questiontext'>Question text: </label>
        <input
            className="textbox"
            id='questiontext'
            type='text'
            placeholder='Question text'
            autoComplete='off'
            required
        //onChange={}

        />

        {createChoices()}

              
    </div>
};


const ChoiceComponent = (props: Props) => {
    return <div className="choice-component">
        <label htmlFor='choicetext'>Choice text: </label>
        <input
            className="textbox"
            id='choicetext'
            type='text'
            placeholder='Question text'
            autoComplete='off'
            required
            //onChange={}
        />

        <label htmlFor='ischoicecorrect'>Is correct answer?: </label>
        <input id='ischoicecorrect' type='radio' name='choice' value='male' checked />
    </div>
};