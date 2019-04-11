import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Home } from './Home';
import { Login } from './Login';
import { Register } from './Register';
import { FourZeroFour } from './FourZeroFour';
import { NavMenu } from './NavMenu';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';
import { CreateGroup } from './trainer/CreateGroup';
import { MyGroup } from './trainer/MyGroup';
import { About } from './About';
import { Settings } from './Settings';
import { AddToGroup } from './trainer/AddToGroup';
import { RemoveFromGroup } from './trainer/RemoveFromGroup';
import { CreateQuiz } from './trainer/CreateQuiz';
import { ViewQuizzes } from './ViewQuizzes';
import { ViewQuiz } from './ViewQuiz';
import { ViewUncompleteQuizzes } from './trainee/ViewUncompletedQuizzes';
import { ViewCompleteQuizzes } from './trainee/ViewCompletedQuizzes';
import { StartQuiz } from './trainee/StartQuiz';
import { ViewQuizResult } from './trainee/ViewQuizResult';
import { QuizResultList } from './trainer/QuizResultsList';
import { TraineesByQuizResults } from './trainer/TraineesByQuizResults';
import { PrivateRoute } from './routehelpers/PrivateRoute';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
export class RouteContainer extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
        await this.props.authStore.getUserTheme();
    }

    public render() {
        const { match } = this.props;

        let userJSON = JSON.parse(localStorage.getItem('userDetails') || '{}');

        let isloggedIn = Object.keys(userJSON).length != 0 ? true : false;
        let isTrainer = false;
        let isTrainee = false;

        if (isloggedIn) {
            isTrainer = userJSON.user.userRole == 'trainer' ? true : false;
            isTrainee = userJSON.user.userRole == 'trainee' ? true : false;
        }

        return <div className={`page-parent ${this.props.authStore.userTheme}`}>
            <header>
                <NavMenu {...this.props} />
            </header>

            <main>
                <Switch>
                    <Route exact path={`${match.url}`} render={(props: any) => <Home {...props} />} />

                    <Route exact path={`${match.url}login`} render={(props: any) => {
                        if (isloggedIn) {
                            return <Redirect to={{
                                pathname: '/',
                                state: { from: props.location }
                            }} />
                        } else {
                            return <Login {...props} />
                        }
                    }} />

                    <Route exact path={`${match.url}register`} render={(props: any) => {
                        if (isloggedIn) {
                            return <Redirect to={{
                                pathname: '/',
                                state: { from: props.location }
                            }} />
                        } else {
                            return <Register {...props} />
                        }
                    }} />

                    <Route exact path={`${match.url}creategroup`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainer) {
                                return <CreateGroup {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}mygroup`} render={(props: any) => {
                    if (isloggedIn) {
                        if (isTrainer) {
                            return <MyGroup {...props} />
                        } else {
                            return <Redirect to={{
                                pathname: '/',
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

                    {/*<PrivateRoute path={`${match.url}mygroup`} component={MyGroup} roleRequired={"trainer"} />*/}

                    {/*<Route exact path={`${match.url}mygroup`} component={PrivateRoute(MyGroup)} />*/}

                    <Route exact path={`${match.url}addtogroup`} render={(props: any) => {
                    if (isloggedIn) {
                        if (isTrainer) {
                            return <AddToGroup {...props} />
                        } else {
                            return <Redirect to={{
                                pathname: '/',
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

                    {/*<PrivateRoute path={`${match.url}addtogroup`} component={AddToGroup} roleRequired={"trainer"} />*/} {/* Breaks this.props.history.push. This component should use a route. */}

                    <Route exact path={`${match.url}removefromgroup`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainer) {
                                return <RemoveFromGroup {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}createquiz`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainer) {
                                return <CreateQuiz {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}viewquizzes`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainer) {
                                return <ViewQuizzes {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}viewquiz/:quizID`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainer) {
                                return <ViewQuiz {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}viewuncompletedquizzes`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainee) {
                                return <ViewUncompleteQuizzes {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}startquiz/:quizID`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainee) {
                                return <StartQuiz {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}viewcompletedquizzes`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainee) {
                                return <ViewCompleteQuizzes {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}viewquizresult/:quizID`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainee) {
                                return <ViewQuizResult {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}resultsbyquiz`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainer) {
                                return <QuizResultList {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}traineesbyquizresults/:quizID`} render={(props: any) => {
                        if (isloggedIn) {
                            if (isTrainer) {
                                return <TraineesByQuizResults {...props} />
                            } else {
                                return <Redirect to={{
                                    pathname: '/',
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

                    <Route exact path={`${match.url}about`} component={About} />

                    <Route exact path={`${match.url}settings`} render={(props: any) => {
                        return <Settings {...props} />
                    }} />

                    <Route component={FourZeroFour} />
                </Switch>
            </main>
        </div>;
    }
}