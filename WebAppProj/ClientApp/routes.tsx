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

export const routes = <Layout> {/*switch statement, perhaps move to seperate component*/}
    <Switch>
        <Route exact path='/' component={ Home } />
        <Route exact path='/counter' component={ Counter } />
        <Route exact path='/fetchdata' component={FetchData} />
        <Route exact path='/login' component={Login} /> {/*render={props => <Login {...props}/>}*/}
        <Route exact path='/register' component={Register} />
        {/*<Redirect to="/404" component={Register}/>*/}
        <Route component={FourZeroFour} />
    </Switch>
</Layout>;
