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
            <div className='page-header'>
                <h1>Register</h1>
            </div>
            <div className='page-content'>
                <p>Please register with your details below</p>
                <form onSubmit={this.formSubmit}>
                    <div className='form-group'>
                        <label htmlFor='username'>Username (email):</label>
                        <input
                            className='textbox form-control'
                            id='username'
                            type='email'
                            placeholder='Username (email)'
                            autoComplete='off'
                            required
                            onChange={this.onUsernameChange}
                            maxLength={20}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password:</label>
                        <input
                            className='textbox form-control'
                            id='password'
                            type='password'
                            placeholder='Password'
                            autoComplete='off'
                            required
                            onChange={this.onPasswordChange}
                            maxLength={25}
                            minLength={8}
                            //pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$)$"
                            //pattern="[0-9]"
                            //pattern="^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=\S+$)$"
                            //title="Password must contain atlease: 1 uppercase letter, 1 lowercase letter and a number."
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='role'>Role:</label>
                        <select
                            id='role'
                            className='form-control'
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
                    </div>
                    <div className='form-group'>
                        <label htmlFor='firstname'>Firstname:</label>
                        <input
                            className='textbox form-control'
                            id='firstname'
                            type='text'
                            placeholder='Firstname'
                            autoComplete='off'
                            required
                            onChange={this.onFirstnameChange}
                            maxLength={25}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='surname'>Surname:</label>
                        <input
                            className='textbox form-control'
                            id='surname'
                            type='text'
                            placeholder='Surname'
                            autoComplete='off'
                            required
                            onChange={this.onSurnameChange}
                            maxLength={25}
                        />
                    </div>
                    <button className='btn btn-primary strd-btn register-button'
                        onClick={
                            this.register
                        }
                    > Register
                </button>

                    <div>{this.props.authStore.registerError}</div>
                </form>
            </div>
        </div>;
    }

    private formSubmit = (e: any) => {
        e.preventDefault();
    }

    private register = async (e: any) => {
        let form = document.getElementsByTagName('form')[0];

        if (form.checkValidity()) {
            let authenticated = await this.props.authStore.userRegister();

            if (authenticated) {
                this.props.history.push('/login');
                alert("You have now registered, please login.");
            } else {
                alert("Failed to register.");
                //return false;
            }
            //Prevent the page from refreshing when the form is submitted
            e.preventDefault();
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

    private onUserRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        let userRole = e.target.value;

        this.props.authStore.onUserRoleChange(userRole);
    }

    private onFirstnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let firstname = e.target.value;

        this.props.authStore.onFirstnameChange(firstname);
    }

    private onSurnameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let surname = e.target.value;

        this.props.authStore.onSurnameChange(surname);
    }
}
