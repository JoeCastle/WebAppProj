//https://blog.logrocket.com/react-router-dom-set-up-essential-components-parameterized-routes-505dc93642f1
//https://reacttraining.com/react-router/web/example/no-match
//https://reacttraining.com/react-router/web/example/auth-workflow

import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RouteContainer } from './components/RouteContainer';

//TODO:
/* Experiment with Redirect and <Login>.
 * Perhaps move routes/switch to seperate component
 * Try adding routs to components, (Private route) see: https://www.pointblankdevelopment.com.au/blog/135/react-redux-with-aspnet-core-20-login-registration-tutorial-example#private-route-jsx
 * Also see following for private route components - https://tylermcginnis.com/react-router-protected-routes-authentication/
 * See child routes and id routes
 * https://stackoverflow.com/questions/49390063/how-to-use-role-based-authentication-in-react-router-dom
 */

export const routes = <Layout>
    <Route path='/' render={(props: any) => <RouteContainer {...props} />} />
</Layout>;
