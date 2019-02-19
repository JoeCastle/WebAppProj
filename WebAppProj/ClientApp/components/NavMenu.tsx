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

    componentDidMount() {

    }

    public render() {
        let isTrainer = this.props.authStore.isLoggedIn && this.props.authStore.userRole == "trainer";
        let isTrainee = this.props.authStore.isLoggedIn && this.props.authStore.userRole == "trainee";

        let trainerHasGroup = this.props.authStore.userGroupID != 1 && isTrainer;
        let traineeHasGroup = this.props.authStore.userGroupID != 1 && isTrainee;

        //debugger;

        return <div className='main-nav'>
            <div className='navbar navbar-inverse'>
                <div className='navbar-header'>
                    <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='.navbar-collapse'>
                        <span className='sr-only'>Toggle navigation</span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                        <span className='icon-bar'></span>
                    </button>
                    <Link className='navbar-brand' to={'/'}>WebAppProj</Link>
                </div>
                <div className='clearfix'></div>
                <div className='navbar-collapse collapse'>
                    <ul className='nav navbar-nav'>
                        <li>
                            <NavLink to={'/'} exact activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> Home
                            </NavLink>
                        </li>
                        <li>
                            {!this.props.authStore.isLoggedIn &&
                                <NavLink to={'/login'} activeClassName='active'>
                                    <span className='glyphicon glyphicon-th-list'></span> Login
                                </NavLink>
                            }
                        </li>
                        <li>
                            {!this.props.authStore.isLoggedIn &&
                                <NavLink to={'/register'} activeClassName='active'>
                                    <span className='glyphicon glyphicon-th-list'></span> Register
                            </NavLink>
                            }
                        </li>
                        <li>
                            {isTrainer &&
                                <div className="dropdown">
                                    <button className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className='glyphicon glyphicon-th-list'></span> Group <span className="caret"></span>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {!trainerHasGroup &&
                                            <NavLink to={'/creategroup'} activeClassName='active'>
                                                <span className='glyphicon glyphicon-th-list'></span> Create group
                                            </NavLink>
                                    }
                                    {trainerHasGroup &&
                                        <NavLink to={'/mygroup'} activeClassName='active'>
                                            <span className='glyphicon glyphicon-th-list'></span> My group
                                            </NavLink>
                                    }
                                        {trainerHasGroup &&
                                            <NavLink to={'/addtogroup'} activeClassName='active'>
                                                <span className='glyphicon glyphicon-th-list'></span> Add trainee
                                            </NavLink>
                                        }
                                        {trainerHasGroup &&
                                            <NavLink to={'/removefromgroup'} activeClassName='active'>
                                                <span className='glyphicon glyphicon-th-list'></span> Remove trainee
                                            </NavLink>
                                        }
                                    </div>
                                </div>
                            }
                        </li>
                        <li>
                            {isTrainer &&
                                <div className="dropdown">
                                    <button className="dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span className='glyphicon glyphicon-th-list'></span> Quizzes <span className="caret"></span>
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {trainerHasGroup &&
                                            <NavLink to={'/viewquizzes'} activeClassName='active'>
                                                <span className='glyphicon glyphicon-th-list'></span> View quizzes
                                            </NavLink>
                                        }
                                        {trainerHasGroup &&
                                            <NavLink to={'/createquiz'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-pencil'></span> Create quiz
                                            </NavLink>
                                        }
                                    </div>
                                </div>
                            }
                        </li>
                        <li>
                            <NavLink to={'/about'} exact activeClassName='active'>
                                <span className='glyphicon glyphicon-home'></span> About
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to={'/settings'} exact activeClassName='active'>
                                <span className='glyphicon glyphicon-cog'></span> Settings
                            </NavLink>
                        </li>
                        <li>
                            {this.props.authStore.isLoggedIn &&
                                <a href='#' className='nav-a-placeholder' onClick={this.handleLogout}><span className='glyphicon glyphicon-off'></span> Logout</a>
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
            await this.props.authStore.userLogout();

            this.props.history.push('/login');
        }
    }
}
