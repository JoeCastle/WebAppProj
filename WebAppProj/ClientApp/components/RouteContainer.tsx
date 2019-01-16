import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from './Layout';
import { Home } from './Home';
import { FetchData } from './FetchData';
import { Counter } from './Counter';
import { Login } from './Login';
import { Register } from './Register';
import { FourZeroFour } from './FourZeroFour';
import { TrainerHome } from './TrainerHome';
import { TraineeHome } from './TraineeHome';
import { NavMenu } from './NavMenu';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
export class RouteContainer extends React.Component<Props> {
    componentDidMount() {
        //this.props.authStore.isUserLoggedIn();
        //TODO: On page refresh, check that the JWT is still valid, if so, update the state.
    }

    public render() {
        const { match } = this.props;

        return <div className="page-parent">
            <Route path={`${match.url}`} render={(props: any) => <NavMenu {...props} />} />
            <Switch>
                <Route exact path={`${match.url}`} component={Home} />
                <Route exact path={`${match.url}home`} render={(props: any) => {
                    /*let user: UserDetails = JSON.parse(localStorage.getItem('userDetails'));
                    const userjson = localStorage.getItem('userDetails');
                    let user: UserDetails = JSON.parse(userjson);*/
                    var userJSON = JSON.parse(localStorage.getItem('userDetails') || '{}'); //Replace with not null operator:
                    //https://stackoverflow.com/questions/46915002/argument-of-type-string-null-is-not-assignable-to-parameter-of-type-string
                    //https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#non-null-assertion-operator

                    if (Object.keys(userJSON).length != 0) {
                        if (userJSON.user.userRole == 'Trainer') {
                            return <TrainerHome {...props} />
                        } else if (userJSON.user.userRole == 'Trainee') {
                            return <TraineeHome {...props} />
                        } else {
                            return <Redirect to={{
                                pathname: '/login',
                                state: { from: props.location }
                            }} />
                        }
                    } else {
                        return <Redirect to={{
                            pathname: '/login',
                            state: { from: props.location }
                        }} />
                    }
                }} />

                <Route exact path={`${match.url}login`} render={(props: any) => {
                    var userJSON = JSON.parse(localStorage.getItem('userDetails') || '{}');

                    if (Object.keys(userJSON).length != 0) {
                        return <Redirect to={{
                            pathname: '/home',
                            state: { from: props.location }
                        }} />
                    } else {
                        return <Login {...props} />
                    }
                }} />


                <Route exact path={`${match.url}counter`} component={Counter} />
                <Route exact path={`${match.url}fetchdata`} component={FetchData} />
                {/*<Route exact path='/login' component={Login} />*/} {/*render={props => <Login {...props}/>}*/}
                {/* <Route exact path='/login' render={(props: any) => <Login {...props} />} />*/}
                {/*<Route exact path='/register' component={Register} />*/}
                <Route exact path='/register' render={(props: any) => <Register {...props} />} />
                {/*<Redirect to="/404" component={Register}/>*/}

                {/*<Route exact path='/' render={props => ( //if role trainer else if role trainee
            localStorage.getItem('userDetails')
                ? <TrainerHome {...props} />
                : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )} />*/}



                <Route component={FourZeroFour} />
            </Switch>
        </div>;
    }


}
