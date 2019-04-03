﻿//https://devhints.io/mobx
//https://devhints.io/react
//https://github.com/pinqy520/mobx-persist
//https://reactcheatsheet.com/


//https://serverless-stack.com/chapters/redirect-on-login-and-logout.html


import { observable, computed, reaction, action } from 'mobx';
import { api } from '../../api';
import UserLoginDetails from '../../models/userLoginDetails';
import UserRegisterDetails from '../../models/userRegisterDetails';
import CurrentUserDetails from '../../models/currentUserDetails';
import { RouteComponentProps } from 'react-router';
import { Redirect } from 'react-router-dom';
import browserHistory from '../../history';

class AuthStore {
    @observable userID = -1;
    @observable username = "";
    @observable password = "";
    @observable confirmPassword = "";
    @observable isLoggedIn = false;
    @observable isRegistered = false;
    @observable userRole = "";
    @observable userGroupID = -1;
    @observable firstname = "";
    @observable surname = "";
    @observable registerError = "";

    @observable validating = false;

    @observable userTheme = '';

    /*@observable user = ({
        username: "",
        password: "",
        isLoggedIn: false;
    })*/

    @action
    public userLogin = async (): Promise<boolean> => {
        //Validate username and password, potentially do this in the component.
        //Check we exist in database.
        //Log the user in.
        if (this.username != "" && this.password != "") {
            
            //Create data transfer object
            let userLoginDetailsDTO: UserLoginDetails = {
                username: this.username,
                password: this.password
            }

            //Use fetch to call the login controller
            let userDetails: CurrentUserDetails = await api.loginUser(userLoginDetailsDTO);

            //TODO: Update what is being stored in local storage, should just by jwt and accessibility preferences
            //Check response
            if (userDetails) {
                this.setIsLoggedIn(true);
                localStorage.setItem('userDetails', JSON.stringify(userDetails)); //consider using a user object that contains username/id, jwt and other info, role and name
                console.log(userDetails);
                console.log(localStorage.getItem('userDetails'));
                return true;
            } else {
                console.log(userDetails);
                console.log(localStorage.getItem('userDetails'));
                this.setIsLoggedIn(false);
                return false;
            }
            

            //browserHistory.push('/home');

            //Push location - https://stackoverflow.com/questions/42701129/how-to-push-to-history-in-react-router-v4

            //alert(JSON.stringify(userDetails));      

            //---------------
            //This works.
            /*const rawResponse = await fetch('api/Auth/UserLogin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userLoginDetailsDTO)
            });
            const content = await rawResponse.json();

            console.log(content);
            alert(content);*/

            //----------------

        } else {
            this.setIsLoggedIn(false);
            return false;
        }
        
    }

    @action
    public userLogout = async (manualLogout?: boolean): Promise<void> => {
        this.isLoggedIn = false;
        this.username = "";
        this.password = "";
        this.confirmPassword = "";
        this.userRole = "";
        this.userGroupID = -1;
        this.isRegistered = false;
        localStorage.removeItem('userDetails');
        sessionStorage.removeItem('userDetails');

        if (!manualLogout) {
            //location.href = '/login';
            //location.replace('/login');
            //history.pushState(null, '', '/login');
            //history.replaceState(null, '', '/login');
            browserHistory.push('/login');
            //browserHistory.replace('/login');
        }       
    }

    @action
    public userRegister = async (): Promise<boolean> => {
        //Validate username and password, potentially do this in the component.
        //Check that the password and conform password match.
        //Check that these credentials don't already exist.
        //Add user credentials to database.
        //Log the user in.


        //Change to this format:
        //if (checkfail) then return false
        //if (checkfail) then return false
        //if (authenticated) then return true
        //else return false

        if (this.username != "" && this.password != "" && this.confirmPassword != "" && this.userRole != "") {
            //Create data transfer object
            let userRegisterDetailsDTO: UserRegisterDetails = {
                username: this.username,
                password: this.password,
                userRole: this.userRole,
                firstname: this.firstname,
                surname: this.surname
            }

            //Use fetch to call the login controller
            let isRegistered = await api.registerUser(userRegisterDetailsDTO);

            //Check response
            if (isRegistered) {
                this.setIsRegistered(true);
                this.setRegisterError("");
                return true;
            } else {
                this.setIsRegistered(false);
                this.setRegisterError("Failed to register, please try again.");
                return false;
            }
        } else {
            this.setIsRegistered(false);
            return false;
        }
    }

    @action
    private setUserObservables = (userDetails: CurrentUserDetails): void => {
        //TODO: Add other user information, first and surnames etc. groupname?
        this.setIsLoggedIn(true);
        this.username = userDetails.user.username || "";
        this.userRole = userDetails.user.userRole;
        this.userGroupID = userDetails.user.groupID;
        this.userID = userDetails.user.userID;
    }

    @action
    public validateJWT = async (): Promise<void> => {
        //this.setIsLoggedIn(true);

        //check if local storage/jwt exists
        let userJSON = JSON.parse(localStorage.getItem("userDetails") || '{}');
        let isLoggedIn = Object.keys(userJSON).length != 0 ? true : false;
        //debugger;

        if (Object.keys(userJSON).length != 0) {
            let responseJson: CurrentUserDetails = await api.verifyJWT(userJSON.user.jwt);

            if (responseJson != null) {
                this.setUserObservables(responseJson);
            } else { //400 for bad request
                if (isLoggedIn) {
                    this.userLogout();
                }
            }
        } else {
            if (isLoggedIn) {
                this.userLogout();
            }
        }
    }

    @action
    public setUserTheme = (): void => {
        let themeJSON = JSON.parse(localStorage.getItem('theme') || '{}');
        let themeClass = Object.keys(themeJSON).length != 0 ? 'high-contrast-theme' : '';

        if (themeClass == '') {
            localStorage.setItem('theme', JSON.stringify('high-contrast-theme'));
            this.userTheme = 'high-contrast-theme';
            document.body.classList.add('high-contrast-theme');
            let html = document.getElementsByTagName('html')[0];
            html.classList.add('high-contrast-theme');
        } else {
            localStorage.removeItem('theme');
            this.userTheme = '';
            document.body.classList.remove('high-contrast-theme');
            let html = document.getElementsByTagName('html')[0];
            html.classList.remove('high-contrast-theme');
        }
    }

    @action
    public getUserTheme = async (): Promise<void> => {
        let themeJSON = JSON.parse(localStorage.getItem('theme') || '{}');
        let themeClass = Object.keys(themeJSON).length != 0 ? 'high-contrast-theme' : '';

        this.userTheme = themeClass;

        document.body.classList.add(themeClass);

        let html = document.getElementsByTagName('html')[0];
        html.classList.add(themeClass);
    }

    @action
    private setRegisterError = (registerError: string): void => {
        this.registerError = registerError;
    }

    @action
    private setIsLoggedIn = (isLoggedIn: boolean): void => {
        this.isLoggedIn = isLoggedIn;
    }

    @action
    private setIsRegistered = (isRegistered: boolean): void => {
        this.isRegistered = isRegistered;
    }

    //Figure out how to put this into one function
    @action
    public onUsernameChange = (name: string): void => {
        this.username = name;
    }

    @action
    public onPasswordChange = (password: string): void => {
        this.password = password;
    }

    @action
    public onConfirmPasswordChange = (confirmPassword: string): void => {
        this.confirmPassword = confirmPassword;
    }

    @action
    public onUserRoleChange = (userRole: string): void => {
        this.userRole = userRole;
    }

    @action
    public onFirstnameChange = (firstname: string): void => {
        this.firstname = firstname;
    }

    @action
    public onSurnameChange = (surname: string): void => {
        this.surname = surname;
    }
}

const authStore = new AuthStore();

export default authStore;
export { AuthStore };