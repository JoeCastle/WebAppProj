import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
export class NavMenu extends React.Component<Props> {

    public render() {
        let isTrainer = this.props.authStore.isLoggedIn && this.props.authStore.userRole == "trainer";
        let isTrainee = this.props.authStore.isLoggedIn && this.props.authStore.userRole == "trainee";

        let trainerHasGroup = this.props.authStore.userGroupID != 1 && isTrainer;
        let traineeHasGroup = this.props.authStore.userGroupID != 1 && isTrainee;

        return <div className='main-nav'>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'}><img src="TrainingAppLogo.png" alt="Training App logo" /></Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={'/'} exact activeClassName='active'>
                                <i className='fa fa-home fa-fw' aria-hidden='true'></i> Home
                            </NavLink>
                        </li>
                        <li>
                            {isTrainer &&
                                <div className="dropdown">
                                    <button className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i className='fa fa-users fa-fw' aria-hidden='true'></i> Group <span className="caret"></span>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {!trainerHasGroup &&
                                            <NavLink to={'/creategroup'} activeClassName='active'>
                                                <i className='fa fa-user-edit fa-fw' aria-hidden='true'></i> Create group
                                            </NavLink>
                                        }
                                        {trainerHasGroup &&
                                            <NavLink to={'/mygroup'} activeClassName='active'>
                                                <i className='fa fa-user-friends fa-fw' aria-hidden='true'></i> My group
                                            </NavLink>
                                        }
                                        {trainerHasGroup &&
                                            <NavLink to={'/addtogroup'} activeClassName='active'>
                                                <i className='fa fa-user-plus fa-fw' aria-hidden='true'></i> Add trainee
                                            </NavLink>
                                        }
                                        {trainerHasGroup &&
                                            <NavLink to={'/removefromgroup'} activeClassName='active'>
                                                <i className='fa fa-user-minus fa-fw' aria-hidden='true'></i> Remove trainee
                                            </NavLink>
                                        }
                                    </div>
                                </div>
                            }
                        </li>
                        <li>
                            {trainerHasGroup &&
                                <div className='dropdown'>
                                    <button className='dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                        <i className='fa fa-pencil-ruler fa-fw' aria-hidden='true'></i> Quizzes <span className="caret"></span>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {trainerHasGroup &&
                                            <NavLink to={'/viewquizzes'} activeClassName='active'>
                                                <i className='fa fa-list fa-fw' aria-hidden='true'></i> View quizzes
                                            </NavLink>
                                        }
                                        {trainerHasGroup &&
                                            <NavLink to={'/createquiz'} activeClassName='active'>
                                                <i className='fa fa-pen fa-fw' aria-hidden='true'></i> Create quiz
                                            </NavLink>
                                        }
                                    </div>
                                </div>
                            }
                        </li>

                        <li>
                            {trainerHasGroup &&
                                <div className='dropdown'>
                                    <button className='dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                        <i className='fa fa-poll fa-fw' aria-hidden='true'></i> Results <span className="caret"></span>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {trainerHasGroup &&
                                            <NavLink to={'/resultsbyquiz'} activeClassName='active'>
                                                <i className='fa fa-pen fa-fw' aria-hidden='true'></i> Results by quiz
                                            </NavLink>
                                        }
                                    </div>
                                </div>
                            }
                        </li>

                        <li>
                            {traineeHasGroup &&
                                <div className='dropdown'>
                                    <button className='dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>
                                        <i className='fa fa-pencil-ruler fa-fw' aria-hidden='true'></i> Quizzes <span className="caret"></span>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <NavLink to={'/viewuncompletedquizzes'} activeClassName='active'>
                                            <i className='fa fa-pen fa-fw' aria-hidden='true'></i> Uncompleted quizzes
                                            </NavLink>
                                        <NavLink to={'/viewcompletedquizzes'} activeClassName='active'>
                                            <i className='fa fa-list fa-fw ' aria-hidden='true'></i> Completed quizzes
                                            </NavLink>
                                    </div>
                                </div>
                            }
                        </li>
                        <li>
                            <NavLink to={'/about'} exact activeClassName='active'>
                                <i className='fa fa-question-circle fa-fw' aria-hidden='true'></i> About website
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/settings'} exact activeClassName='active'>
                                <i className='fa fa-wheelchair fa-fw' aria-hidden='true'></i> Settings
                            </NavLink>
                        </li>
                        <li>
                            {!this.props.authStore.isLoggedIn &&
                                <NavLink to={'/login'} activeClassName='active'>
                                    <i className='fa fa-sign-in-alt fa-fw' aria-hidden='true'></i> Login
                                </NavLink>
                            }
                        </li>
                        <li>
                            {!this.props.authStore.isLoggedIn &&
                                <NavLink to={'/register'} activeClassName='active'>
                                    <i className='fa fa-plus-circle fa-fw' aria-hidden='true'></i> Register
                            </NavLink>
                            }
                        </li>
                        <li>
                            {this.props.authStore.isLoggedIn &&
                                <a href='#' className='nav-a-placeholder' onClick={this.handleLogout}><i className='fa fa-sign-out-alt fa-fw' aria-hidden='true'></i> Logout</a>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </div>;
    }

    private handleLogout = async (e: any) => {
        e.preventDefault();

        if (confirm('Are you sure you want to logout?')) {
            await this.props.authStore.userLogout(true);

            this.props.history.push('/login');
        }
    }
}
