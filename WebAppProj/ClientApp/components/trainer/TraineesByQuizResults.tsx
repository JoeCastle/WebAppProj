import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { inject, observer } from 'mobx-react';
import { action } from 'mobx';
import { Link } from 'react-router-dom';
import { ResultStore } from '../../stores/ResultsStore/ResultsStore';
import authStore, { AuthStore } from '../../stores/AuthStore/AuthStore';
import { QuizStore } from '../../stores/QuizStore/QuizStore';
import { CSVLink } from 'react-csv'; //https://www.npmjs.com/package/react-csv

interface Props extends RouteComponentProps<any>, React.Props<any> {
    quizStore: QuizStore,
    authStore: AuthStore,
    resultStore: ResultStore
}

interface bar {
    traineeusername: string;
    firstname: string;
    surname: string;
    result: string;
}

@inject('quizStore', 'authStore', 'resultStore')
@observer
export class TraineesByQuizResults extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.resultStore.getTraineesResultsByQuizID(this.props.match.params.quizID);

        //this.addData();
    }

    trainees = this.props.resultStore.traineesByQuiz;

    headers = [
        { label: "Username", key: "traineeusername" },
        { label: "First Name", key: "firstname" },
        { label: "Surname", key: "surname" },
        { label: "Result", key: "result" },
    ];

    //data = [] as any;

    //addData() {
    //    for (let trainee in this.trainees) {
    //        var item = { traineeusername: this.trainees[trainee].username, firstname: this.trainees[trainee].firstname, surname: this.trainees[trainee].surname, result: this.trainees[trainee].result }
    //        this.data.push(item);
    //    }
    //}

    dataExport: bar[] = this.props.resultStore.dataExport.slice()
    headersExport = this.props.resultStore.headersExport;
   
    public render() {
        return <div className="page">
            <div className='page-header'>
                <h1>List of trainees who have completed this quiz, with their results.</h1>
            </div>

            <div className='page-content'>
                <p>Here you can view a list of quizzes that belong to your group. Click on one of the quizzes below to view the results for trainees that have completed that quiz.</p>

                {/*{this.props.resultStore.dataExport.length > 0 &&
                    <button onClick={() => {
                        const element = document.getElementById('csvlink')!;
                        element.click();
                    }

                    }>Download CSV</button>
                }*/}
                {/*https://stackoverflow.com/questions/53327674/passing-api-data-through-react-csv
                 */}
                {/*{this.dataExport.length == 5 &&
                    <CSVLink
                        data={this.dataExport}
                        headers={this.headers}
                        filename={`Group${authStore.userGroupID}Quiz${this.props.match.params.quizID}Results.csv`}
                        className='btn btn-primary export-btn'
                        id='csvlink'

                        onClick={() => {
                            //this.addData();
                        }}
                    >
                        Export quiz results
                </CSVLink>
                }*/}

                <CSVLink
                    data={this.props.resultStore.dataExport.slice()} //.slice() added as the initial data type is "observable array" not "array"
                    headers={this.headers}
                    filename={`Group${authStore.userGroupID}Quiz${this.props.match.params.quizID}Results.csv`}
                    className='btn btn-primary export-btn'
                    id='csvlink'
                >
                    Export quiz results
                </CSVLink>
                <div className="addToGroupListsContainer">
                    <div className="noGroupUsersList">
                        {
                            this.trainees.map(
                                trainee => <div
                                    key={trainee.userID}
                                    //onClick={() => this.selectUser(user)}
                                >
                                    {trainee.userID}: {trainee.firstname} {trainee.surname} - Score {trainee.result}/5
                                </div>
                            )
                        }

                        {!this.trainees && <div>No trainees have completed this quiz.</div>}
                    </div>
                </div>
            </div>
        </div>;
    }
};