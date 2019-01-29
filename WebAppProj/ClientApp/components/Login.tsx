import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
export class Login extends React.Component<Props> {
    public render() {
        return <div className="page login-page">
            <h1>This is the login page</h1>
            <p>Please login with your details below</p>
            <form onSubmit={this.formSubmit}>
                <label htmlFor='username'>Username (email):</label>
                <input
                    className="textbox"
                    id='username'
                    type='email'
                    placeholder='Username (email)'
                    autoComplete='off'
                    required
                    onChange={this.onUsernameChange}

                />
                <label htmlFor='password'>Password:</label>
                <input
                    className="textbox"
                    id='password'
                    type='password'
                    placeholder='Password'
                    autoComplete='off'
                    required
                    onChange={this.onPasswordChange}
                />
                <button className='login-button'
                    onClick={
                        this.login
                    }
                    > Login
                </button>
            </form>
            <button
                onClick={
                    this.logout
                }
            >
                Logout
            </button>
        </div>;
    }

    private formSubmit = (e: any) => {
        e.preventDefault();
    }

    private login = async (e: any) => {
        let authenticated = await this.props.authStore.userLogin();

        //Prevent the page from refreshing when the form is submitted
        e.preventDefault();

        if (authenticated) {
            this.props.history.push('/');
        } else {
            return false;
        }
    }

    private onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let name = e.target.value;

        this.props.authStore.onUsernameChange(name);
    }

    private onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let password = e.target.value;

        this.props.authStore.onPasswordChange(password);
    }

    private logout = () => {
        this.props.authStore.userLogout();
    }
}