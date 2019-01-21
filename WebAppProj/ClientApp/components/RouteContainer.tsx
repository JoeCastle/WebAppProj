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

//https://auth0.com/blog/react-router-4-practical-tutorial/
//https://logrocket.com/blog/jwt-authentication-best-practices/
//https://stormpath.com/blog/where-to-store-your-jwts-cookies-vs-html5-web-storage
//http://qaru.site/questions/2456228/react-typescript-hoc-passing-component-as-the-prop
//https://www.onedot.com/blog/tricks-with-redux-and-react-router
//https://stackoverflow.com/questions/53104165/implement-react-router-privateroute-in-typescript-project
//https://github.com/mhaagens/react-mobx-react-router4-boilerplate
//https://github.com/mhaagens/react-mobx-react-router4-boilerplate
//https://alexhisen.gitbooks.io/mobx-recipes/content/observable-based-routing.html
//https://www.google.com/search?rlz=1C1CHBF_en-GBGB755GB755&ei=YyVCXPjgIp2E1fAPov2nqAQ&q=react+mobx+role+based+routing&oq=react+mobx+role+based+routing&gs_l=psy-ab.3...2523.3211..3347...0.0..0.203.693.5j1j1......0....1..gws-wiz.......0i71j33i21j33i160.2rtnNABkmXc


//@withRouter
@inject('authStore')
@observer
export class RouteContainer extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
    }

    public render() {
        const { match } = this.props;

        return <div className="page-parent">
            <Route path={`${match.url}`} render={(props: any) => <NavMenu {...props} />} />

            <Switch>
                <Route exact path={`${match.url}`} component={Home} />

                {/*The checking here will be potentially moved to the Home component if the TraineeHome and TrainerHome are merged*/}
                <Route exact path={`${match.url}home`} render={(props: any) => {

                    var userJSON = JSON.parse(localStorage.getItem('userDetails') || '{}');

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
                <Route exact path='/register' render={(props: any) => <Register {...props} />} />
                <Route component={FourZeroFour} />
            </Switch>
        </div>;
    }


}


//{
//    this.props.authStore.isAuthenticated &&
//    <Route exact path={`${match.url}home`} render={(props: any) => {

//        var userJSON = JSON.parse(localStorage.getItem('userDetails') || '{}');

//        if (Object.keys(userJSON).length != 0) {
//            if (userJSON.user.userRole == 'Trainer') {
//                return <TrainerHome {...props} />
//            } else if (userJSON.user.userRole == 'Trainee') {
//                return <TraineeHome {...props} />
//            } else {
//                return <Redirect to={{
//                    pathname: '/login',
//                    state: { from: props.location }
//                }} />
//            }
//        } else {
//            return <Redirect to={{
//                pathname: '/login',
//                state: { from: props.location }
//            }} />
//        }
//    }} />
//}