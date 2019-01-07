//http://jasonwatmore.com/post/2018/06/26/aspnet-core-21-simple-api-for-authentication-registration-and-user-management
//http://jasonwatmore.com/post/2017/09/16/react-redux-user-registration-and-login-tutorial-example
//https://github.com/gothinkster/react-mobx-realworld-example-app
//https://github.com/foxhound87/mobx-react-form
//https://medium.com/@foxhound87/automagically-manage-react-forms-state-with-mobx-and-automatic-validation-2b00a32b9769
//https://codesandbox.io/s/nrrZgG8y4
//https://moduscreate.com/blog/ext-js-to-react-handling-data-with-mobx/
//https://www.youtube.com/watch?v=M4kk3Ac0WSM&feature=youtu.be //https://github.com/benawad/gello-world/tree/2_login
//https://medium.com/@KozhukharenkoN/react-form-validation-with-mobx-8ce00233ae27

/*
 Use Identity
 https://www.youtube.com/watch?v=ApPRYnRYpno
 https://www.youtube.com/watch?v=WQywatfis6s
 https://docs.microsoft.com/en-us/aspnet/core/security/authentication/identity?view=aspnetcore-2.2&tabs=visual-studio
 https://stackoverflow.com/questions/47744565/can-we-secure-a-dotnet-core-2-0-react-app-with-only-aspnet-identity
 https://forums.asp.net/t/2113140.aspx?Identity+Login+using+Ajax+MVC
 https://www.pointblankdevelopment.com.au/blog/135/react-redux-with-aspnet-core-20-login-registration-tutorial-example
 https://kimsereyblog.blogspot.com/2017/09/implicit-flow-with-identity-server-and.html
 https://www.youtube.com/watch?v=6fvaDpxJxJo
 https://www.pointblankdevelopment.com.au/blog/135/react-redux-with-aspnet-core-20-login-registration-tutorial-example //https://github.com/cornflourblue/aspnet-core-react-registration-login-example
 https://auth0.com/blog/developing-web-apps-with-asp-dot-net-core-2-dot-0-and-react-part-2/
 http://jasonwatmore.com/post/2018/08/14/aspnet-core-21-jwt-authentication-tutorial-with-example-api
 http://jasonwatmore.com/post/2017/12/07/react-redux-jwt-authentication-tutorial-example
 https://medium.com/@geekrodion/blog-with-asp-net-core-and-react-redux-part-1-authentication-94b11b1a1bc4 //https://github.com/RodionChachura/simple-blog-back //https://github.com/RodionChachura/simple-blog-front
 

SampleCode > MobxApp
ExampleReactMobx
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
export class Login extends React.Component<Props> {
    public render() {
        return <div className="page login-page">
            <h1>This is the login page</h1>
            <p>Please login with your details below</p>
            <form onSubmit={this.formSubmit}>
                <label htmlFor='username'>Username:</label>
                <input
                    className="textbox"
                    id='username'
                    type='text'
                    placeholder='Username'
                    autoComplete='off'
                    required
                    /*onChange={(e) => {
                        this.props.setFieldValue('email', e.target.value);
                    }}*/
                    //value={this.props.email}
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
        </div>;
    }

    private formSubmit = () => {
        
    }

    private login = (e: any) => {
        console.log(this.props.authStore.isLoggedIn);
        this.props.authStore.userLogin();
        console.log(this.props.authStore.isLoggedIn);

        //Prevent the page from refreshing when the form is submitted
        e.preventDefault();
    }

    private onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let name = e.target.value;

        this.props.authStore.onUsernameChange(name);

        console.log(this.props.authStore.username);
    }

    private onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let password = e.target.value;

        this.props.authStore.onPasswordChange(password);

        console.log(this.props.authStore.password);
    }
}