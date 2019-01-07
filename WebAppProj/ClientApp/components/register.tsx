import * as React from 'react';
import { RouteComponentProps } from 'react-router';

export class Register extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div className="page register-page">
            <h1>This is the register page</h1>
            <p>Please register with your details below</p>
            <form>
                <label htmlFor='username'>Username:</label>
                <input
                    className="textbox"
                    id='username'
                    type='text'
                    placeholder='Username'
                    required
                />
                <label htmlFor='password'>Password:</label>
                <input
                    className="textbox"
                    id='password'
                    type='password'
                    placeholder='Password'
                    required
                />
                <label htmlFor='confirmpassword'>Confirm password:</label>
                <input
                    className="textbox"
                    id='confirmpassword'
                    type='password'
                    placeholder='Confirm password'
                    required
                />
                <button className='register-button'

                > Register
                </button>
            </form>
        </div>;
    }
}
