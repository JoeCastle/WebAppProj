//https://blog.logrocket.com/react-router-dom-set-up-essential-components-parameterized-routes-505dc93642f1
//https://reacttraining.com/react-router/web/example/no-match
//https://reacttraining.com/react-router/web/example/auth-workflow

import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { FourZeroFour } from './components/FourZeroFour';
import { TrainerHome } from './components/TrainerHome';
import { TraineeHome } from './components/TraineeHome';
import UserDetails from './models/userDetails';

export const routes = <Layout> {/*switch statement, perhaps move to seperate component*/}
    <Switch>
        {/*<Route exact path='/' component={ Home } />*/}
        <Route exact path='/' render={(props: any) => {
            /*let user: UserDetails = JSON.parse(localStorage.getItem('userDetails'));
            const userjson = localStorage.getItem('userDetails');
            let user: UserDetails = JSON.parse(userjson);*/
            var userJSON = JSON.parse(localStorage.getItem('userDetails'));

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
        }} />

        <Route exact path='/login' render={(props: any) => {
            var userJSON = JSON.parse(localStorage.getItem('userDetails'));

            if (userJSON) {
                return <Redirect to={{
                    pathname: '/',
                    state: { from: props.location }
                }} />
            } else {
                return <Route exact path='/login' render={(props: any) => <Login {...props} />} />
            }
        }} />

        
        <Route exact path='/counter' component={ Counter } />
        <Route exact path='/fetchdata' component={FetchData} />
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
</Layout>;
