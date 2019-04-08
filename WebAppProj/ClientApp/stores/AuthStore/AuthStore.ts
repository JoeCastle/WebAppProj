import { observable, computed, reaction, action } from 'mobx';
import { api } from '../../api';
import UserLoginDetails from '../../models/userLoginDetails';
import UserRegisterDetails from '../../models/userRegisterDetails';
import CurrentUserDetails from '../../models/currentUserDetails';
import browserHistory from '../../history';

class AuthStore {
    @observable userID = -1; //ID of currently logged in user.
    @observable username = ""; //Username of currently logged in user.
    @observable password = ""; //Password of "Register user" form input.
    @observable isLoggedIn = false;
    @observable isRegistered = false;
    @observable userRole = ""; //Role of currently logged in user.
    @observable userGroupID = -1; //Group ID of currently logged in user.
    @observable firstname = ""; //Firstname of currently logged in user.
    @observable surname = ""; //Surname of currently logged in user.
    @observable registerError = "";

    @observable validating = false;

    @observable userTheme = ''; //Username of currently logged in user.

    //Attempts to log the user in to the system using the provided credentials.
    @action
    public userLogin = async (): Promise<boolean> => {

        if (this.username != "" && this.password != "") {
            
            //Create data transfer object
            let userLoginDetailsDTO: UserLoginDetails = {
                username: this.username,
                password: this.password
            }

            //Use fetch to call the login controller
            let userDetails: CurrentUserDetails = await api.loginUser(userLoginDetailsDTO);

            //Check response
            if (userDetails) {
                this.setIsLoggedIn(true);
                localStorage.setItem('userDetails', JSON.stringify(userDetails));
                return true;
            } else {
                this.setIsLoggedIn(false);
                return false;
            }
        } else {
            this.setIsLoggedIn(false);
            return false;
        }
        
    }

    //Logs the user out of the system if they click logout or their JWT has expired.
    @action
    public userLogout = async (manualLogout?: boolean): Promise<void> => {
        this.isLoggedIn = false;
        this.username = "";
        this.password = "";
        this.userRole = "";
        this.userGroupID = -1;
        this.isRegistered = false;
        localStorage.removeItem('userDetails');
        sessionStorage.removeItem('userDetails');

        if (!manualLogout) {
            browserHistory.push('/login');
        }       
    }

    //Registers a new user to the system.
    @action
    public userRegister = async (): Promise<boolean> => {

        if (this.username != "" && this.password != "" && this.userRole != "") {
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

    //Sets the value of observables related to user information after validating the JWT.
    @action
    private setUserObservables = (userDetails: CurrentUserDetails): void => {
        this.setIsLoggedIn(true);
        this.username = userDetails.user.username || "";
        this.userRole = userDetails.user.userRole;
        this.userGroupID = userDetails.user.groupID;
        this.userID = userDetails.user.userID;
    }

    //Validates the current users Json Web Token (JWT).
    @action
    public validateJWT = async (): Promise<void> => {

        //Check if local storage/jwt exists
        let userJSON = JSON.parse(localStorage.getItem("userDetails") || '{}');
        let isLoggedIn = Object.keys(userJSON).length != 0 ? true : false;

        if (Object.keys(userJSON).length != 0) {
            let responseJson: CurrentUserDetails = await api.verifyJWT(userJSON.user.jwt);

            if (responseJson != null) {
                this.setUserObservables(responseJson);
            } else {
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

    //Sets the users CSS theme by adding or removing a class name from the html and body elements.
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

    //Gets the current CSS theme for the user.
    @action
    public getUserTheme = async (): Promise<void> => {
        let themeJSON = JSON.parse(localStorage.getItem('theme') || '{}');
        let themeClass = Object.keys(themeJSON).length != 0 ? 'high-contrast-theme' : '';

        this.userTheme = themeClass;

        if (themeClass != "") {
            document.body.classList.add(themeClass);

            let html = document.getElementsByTagName('html')[0];
            html.classList.add(themeClass);
        }
    }

    /*
     * The folowwing actions/functions handle changes to input values and/or set the value of an observable.
     */
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

    @action
    public onUsernameChange = (name: string): void => {
        this.username = name;
    }

    @action
    public onPasswordChange = (password: string): void => {
        this.password = password;
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