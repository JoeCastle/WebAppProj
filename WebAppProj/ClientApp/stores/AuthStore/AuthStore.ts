//https://devhints.io/mobx
//https://devhints.io/react
//https://github.com/pinqy520/mobx-persist
//https://reactcheatsheet.com/

import { observable, computed, reaction, action } from 'mobx';

class AuthStore {
    @observable username = "";
    @observable password = "";
    @observable confirmPassword = "";
    @observable isLoggedIn = false;
    @observable isRegistered = false;

    /*@observable user = ({
        username: "",
        password: "",
        isLoggedIn: false;
    })*/

    @action
    public userLogin = (): void => {
        //Validate username and password, potentially do this in the component.
        //Check we exist in database.
        //Log the user in.
        if (this.username != "" && this.password != "") {
            this.isLoggedIn = true;
            localStorage.setItem("userID", this.username);
            sessionStorage.setItem("userID", this.username);
        } else {
            this.isLoggedIn = false;
        }
        
    }

    @action
    public userLogout = (): void => {
        this.isLoggedIn = false;
        this.username = "";
        this.password = "";
        this.confirmPassword = "";
        this.isRegistered = false;
        localStorage.clear;
    }

    @action
    public getUserID = (): void => {
        console.log(localStorage.getItem("userID"));
        console.log(sessionStorage.getItem("userID"));
        
    }

    @action
    public userRegister = (): void => {
        //Validate username and password, potentially do this in the component.
        //Check that the password and conform password match.
        //Check that these credentials don't already exist.
        //Add user credentials to database.
        //Log the user in.

        if (this.username != "" && this.password != "" && this.confirmPassword != "") {
            this.isRegistered = true;
        } else {
            this.isRegistered = false;
        }
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
}

const authStore = new AuthStore();

export default authStore;
export { AuthStore };