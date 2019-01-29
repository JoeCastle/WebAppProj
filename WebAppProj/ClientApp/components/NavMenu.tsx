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

                            <NavLink to={'/fetchdata'} activeClassName='active'>
                                <span className='glyphicon glyphicon-th-list'></span> Fetch data
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
                            {this.props.authStore.isLoggedIn &&
                                <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Dropdown button
                                </button>
                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                    <NavLink to={'/register'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-th-list'></span> Register
                                    </NavLink>
                                    <NavLink to={'/register'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-th-list'></span> Register
                                    </NavLink>
                                    <NavLink to={'/register'} activeClassName='active'>
                                        <span className='glyphicon glyphicon-th-list'></span> Register
                                    </NavLink>
                                    </div>
                                </div>
                            }
                        </li>
                        <li>
                            {this.props.authStore.isLoggedIn &&
                                <a href='#' className='nav-a-placeholder' onClick={this.handleLogout}><span className='glyphicon glyphicon-th-list'></span> Logout</a>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </div>;
    }

    private handleLogout = async (e: any) => {
        e.preventDefault();

        await this.props.authStore.userLogout();

        this.props.history.push('/login');
    }
}
