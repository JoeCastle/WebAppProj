﻿import * as React from 'react';
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
    result: number;
}

@inject('quizStore', 'authStore', 'resultStore')
@observer
export class TraineesByQuizResults extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.resultStore.getTraineesResultsByQuizID(this.props.match.params.quizID);
    }

    componentWillUnmount() {
        this.props.resultStore.resetStore();
    }

    trainees = this.props.resultStore.traineesByQuiz;

    headers = [
        { label: "Username", key: "traineeusername" },
        { label: "First Name", key: "firstname" },
        { label: "Surname", key: "surname" },
        { label: "Result", key: "result" },
    ];

    dataExport: bar[] = this.props.resultStore.dataExport.slice()
    headersExport = this.props.resultStore.headersExport;

    public render() {
        return <div className="page trainer-results-page">
            <div className='page-header'>
                <h1>List of trainees who have completed this quiz, with their results.</h1>
            </div>

            <div className='page-content'>
                <p>Here you can view a list of quizzes that belong to your group. Click on one of the quizzes below to view the results for trainees that have completed that quiz.</p>

                {/*Try to move filter code to seperate component. Also move bar interface to seperate file. Also rename bar interface.*/}
                <div className='filter-container'>
                    <input
                        className='form-control filter-input'
                        placeholder='Search by UserID, Username, Firstname, Surname or Score...'
                        onChange={this.filterList} />

                    {this.trainees.length > 0 &&
                        <CSVLink
                            data={this.props.resultStore.dataExport.slice()} //.slice() added as the initial data type is "observable array" not "array"
                            headers={this.headers}
                            filename={`Group${authStore.userGroupID}Quiz${this.props.match.params.quizID}Results.csv`}
                            className='btn btn-primary export-btn'
                            id='csvlink'
                        >
                            Export quiz results
                    </CSVLink>
                    }
                </div>

                <div className="addToGroupListsContainer">
                    <div className="noGroupUsersList">
                        {
                            this.props.resultStore.traineesByQuizFiltered.map(
                                trainee => <div
                                    key={trainee.userID}
                                >
                                    {trainee.userID}: {trainee.firstname} {trainee.surname} - Score {trainee.result}/5
                                </div>
                            )
                        }

                        {/*<ul>
                            {
                                this.trainees.map(
                                    trainee => <li
                                        key={trainee.userID}
                                    >
                                        {trainee.userID}: {trainee.firstname} {trainee.surname} - Score {trainee.result}/5
                                </li>
                                )
                            }

                            {
                                this.props.resultStore.traineesByQuiz.map((trainee) => {
                                    return <li>{trainee.firstname}</li>
                                })
                            }
                        </ul>*/}

                        {this.props.resultStore.traineesByQuizFiltered.length <= 0 && <div>No matching trainees have completed this quiz.</div>}
                    </div>
                </div>
            </div>
        </div>;
    }

    @action
    private filterList = (e: React.ChangeEvent<HTMLInputElement>) => {
        let filter = e.target.value;

        this.props.resultStore.traineesByQuizFiltered = this.props.resultStore.traineesByQuiz.filter((trainee) => {
            let traineeName = trainee.firstname!.toLowerCase() && trainee.surname.toLowerCase();
            let traineeFirstname = trainee.firstname!.toLowerCase();
            let traineeSurname = trainee.surname.toLowerCase();
            let traineeID = trainee.userID.toString().toLowerCase();
            let traineeResult = trainee.result.toString().toLowerCase();
            return (
                traineeName.lastIndexOf(filter.toLowerCase()) !== -1 ||
                traineeFirstname.lastIndexOf(filter.toLowerCase()) !== -1 ||
                traineeSurname.lastIndexOf(filter.toLowerCase()) !== -1 ||
                traineeID.toString().lastIndexOf(filter.toLowerCase()) !== -1 ||
                traineeResult.toString().lastIndexOf(filter.toLowerCase()) !== -1
            )
        })
    }
};