//Javascript fetch API. - https://davidwalsh.name/fetch
//See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch for option for maintaining user session
//See axios or ajax - https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index

//See https://jsonplaceholder.typicode.com/ for placeholder json

//https://stackoverflow.com/questions/29775797/fetch-post-json-data

import UserLoginDetails from '../models/userLoginDetails';
import UserDetails from '../models/userDetails';

/*let getJson = async (url: string) => {
    let responseJson = await fetch(url, {
        credentials: 'include'
    });

    if (responseJson.status === 200) {
        return responseJson.json();
    } else {
        return null;
    }
}*/

//If not returning value/unexpected token, ensure the correct headers are used
//See https://stackoverflow.com/questions/37269808/react-js-uncaught-in-promise-syntaxerror-unexpected-token-in-json-at-posit

// TODO: For authorization - see the following: 
/* https://www.pointblankdevelopment.com.au/blog/135/react-redux-with-aspnet-core-20-login-registration-tutorial-example#auth-header-js
 * https://medium.com/@maison.moa/using-jwt-json-web-tokens-to-authorize-users-and-protect-api-routes-3e04a1453c3e
 * https://stackoverflow.com/questions/47878735/how-to-send-jwt-token-with-fetch-and-cors-to-an-express-server-in-authorization
 * https://www.youtube.com/watch?v=uO8OreL0Ml4
 * https://github.com/dwyl/learn-json-web-tokens
 * 
 * Send JWT with requests, decode it on server to check user permission. (Return ok or not ok)
 */
let postJson = async (url: string, body: any) => {
    let responseJson = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (responseJson.status === 200) {
        return responseJson.json();
    } else if (responseJson.status === 204) {
        return null;
    } else { //400 for bad request
        return responseJson.status;
    }
}

let postJsonResponse = async (url: string, body: any) => {
    let responseJson = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    return responseJson;
}

let loginUser = (userLoginDetails: UserLoginDetails): Promise<UserDetails> => {
    let url = "api/Auth/UserLogin";

    return postJson(url, userLoginDetails);
}

let verifyJWT = (jsonWebToken: string): Promise<Response> => {
    let url = "api/Auth/VerifyJWT";

    return postJsonResponse(url, jsonWebToken);
}

export const api = {
    loginUser,
    verifyJWT,
}