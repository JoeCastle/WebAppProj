import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';
import { CSVLink } from 'react-csv';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
export class Home extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
    }

    csvData = [
        ["", "Quiz 1", "Quiz 2", "Quiz 3", "Quiz 4"],
        ["Ahmed", "0", "10", "5", "5"],
        ["Raed", "0", "5", "10", "5"],
        ["Yezzi", "10", "7", "10", "5"]
    ]

    headers = [
        { label: "First Name", key: "firstname" },
        { label: "Last Name", key: "lastname" },
        { label: "Email", key: "email" }
    ];

    data = [
        { firstname: "Ahmed", lastname: "Tomi", email: "ah@smthing.co.com" },
        { firstname: "Raed", lastname: "Labes", email: "rl@smthing.co.com" },
        { firstname: "Yezzi", lastname: "Min l3b", email: "ymin@cocococo.com" }
    ];

    public render() {
        return (<div className="page">
            <div className='page-header'>
                <h1>Home</h1>
                {/*<CSVLink
                    data={this.csvData}
                    filename={'group1results.csv'}
                >Download me</CSVLink>

                <CSVLink data={this.data} headers={this.headers}>
                    Download me2
                </CSVLink>;*/}
            </div>
            {
                this.props.authStore.userRole == "trainer" &&
                <TrainerHome {... this.props} />
            }
            {
                this.props.authStore.userRole == "trainee" &&
                <TraineeHome {... this.props} />
            }
            {
                this.props.authStore.userRole == "" &&
                <StandardHome {... this.props} />
            }
        </div>)
    }
}

//Functional components
const StandardHome = (props: Props) => {
    return <div className='page-content'>
        You are not logged in.
    </div>
};

const TrainerHome = (props: Props) => {
    return <div className='page-content'>
        Trainer home, welcome {props.authStore.username}
    </div>
};

const TraineeHome = (props: Props) => {
    return <div className='page-content'>
        Trainee home, welcome {props.authStore.username}
    </div>
};
