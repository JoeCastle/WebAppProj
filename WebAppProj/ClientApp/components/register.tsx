//https://dzone.com/articles/aspnet-core-crud-with-reactjs-and-entity-framework
//
//https://jonhilton.net/2017/10/07/a-simple-way-to-secure-your-.net-core-2.0-web-app/
//
//https://jonhilton.net/2017/10/11/secure-your-asp.net-core-2.0-api-part-1---issuing-a-jwt/
//
//https://www.pointblankdevelopment.com.au/blog/135/react-redux-with-aspnet-core-20-login-registration-tutorial-example
//
//http://jasonwatmore.com/post/2017/12/07/react-redux-jwt-authentication-tutorial-example - http://jasonwatmore.com/post/2018/08/14/aspnet-core-21-jwt-authentication-tutorial-with-example-api

/* Try these examples:
 * http://jasonwatmore.com/post/2018/08/14/aspnet-core-21-jwt-authentication-tutorial-with-example-api
 * http://jasonwatmore.com/post/2017/12/07/react-redux-jwt-authentication-tutorial-example
 * https://www.pointblankdevelopment.com.au/blog/135/react-redux-with-aspnet-core-20-login-registration-tutorial-example
 * https://jonhilton.net/2017/10/11/secure-your-asp.net-core-2.0-api-part-1---issuing-a-jwt/ - https://jonhilton.net/security/apis/secure-your-asp.net-core-2.0-api-part-2---jwt-bearer-authentication/ - https://github.com/jonhilt/NetCoreAuth
 * https://jonhilton.net/identify-users-permissions-with-jwts-and-asp-net-core-webapi/
 * https://jonhilton.net/2017/10/07/a-simple-way-to-secure-your-.net-core-2.0-web-app/
 * https://stackoverflow.com/questions/51119926/jwt-authentication-usermanager-getuserasync-returns-null
 * https://www.c-sharpcorner.com/article/jwt-json-web-token-authentication-in-asp-net-core/
 * https://pioneercode.com/post/authentication-in-an-asp-dot-net-core-api-part-3-json-web-token
 * https://www.youtube.com/watch?v=Nq9RmAB9eag
 * https://www.youtube.com/watch?v=FyyPUIAe6kc
 * https://www.youtube.com/watch?v=hjp-JHVsgxQ
 * 
 */

import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
export class Register extends React.Component<Props> {
    public render() {
        return <div className="page register-page">
            <h1>This is the register page</h1>
            <p>Please register with your details below</p>
            <form onSubmit={this.formSubmit}>
                <label htmlFor='username'>Username:</label>
                <input
                    className="textbox"
                    id='username'
                    type='text'
                    placeholder='Username'
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
                <label htmlFor='confirmpassword'>Confirm password:</label>
                <input
                    className="textbox"
                    id='confirmpassword'
                    type='password'
                    placeholder='Confirm password'
                    autoComplete='off'
                    onChange={this.onConfirmPasswordChange}
                    required
                />

                <label htmlFor='role'>Role:</label>
                <select
                    id='role'
                    value={this.props.authStore.userRole}
                    onChange={(e) => {
                        this.onUserRoleChange(e);
                        }}
                    required
                >
                    <option value="">Please select...</option>
                    <option value="trainer">Trainer</option>
                    <option value="trainee">Trainee</option>
                </select>

                <button className='register-button'
                    onClick={
                        this.register
                    }
                > Register
                </button>
            </form>
        </div>;
    }

    private formSubmit = (e: any) => {
        e.preventDefault();
    }

    private register = async (e: any) => {
        console.log(this.props.authStore.isRegistered);
        let authenticated = await this.props.authStore.userRegister();
        console.log(this.props.authStore.isRegistered);

        //Prevent the page from refreshing when the form is submitted
        e.preventDefault();

        if (authenticated) {
            this.props.history.push('/login');
            alert("You have now registered, please login.");
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

    private onConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let confirmPassword = e.target.value;

        this.props.authStore.onConfirmPasswordChange(confirmPassword);
    }

    private onUserRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let userRole = e.target.value;

        this.props.authStore.onUserRoleChange(userRole);
    }
}
