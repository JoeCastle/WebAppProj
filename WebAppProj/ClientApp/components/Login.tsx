//http://jasonwatmore.com/post/2018/06/26/aspnet-core-21-simple-api-for-authentication-registration-and-user-management
//http://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example
//https://github.com/gothinkster/react-mobx-realworld-example-app
import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Login extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div className="page login-page">
            <h1>This is the login page</h1>
            <p>Please login with your details below</p>
            <form>
                <label htmlFor='username'>Username:</label>
                <input
                    className="textbox"
                    id='username'
                    type='text'
                    placeholder='Username'
                    required
                    /*onChange={(e) => {
                        this.props.actions.setFieldValue('email', e.target.value);
                    }}*/
                    //value={this.props.email}
                />
                <label htmlFor='password'>Password:</label>
                <input
                    className="textbox"
                    id='password'
                    type='password'
                    placeholder='Password'
                    required
                /*onChange={(e) => {
                    this.props.actions.setFieldValue('email', e.target.value);
                }}*/
                //value={this.props.email}
                />
                <button className='login-button'
                    /*onClick={
                        this.login
                    }*/
                    > Login
                </button>
            </form>
        </div>;
    }
}
