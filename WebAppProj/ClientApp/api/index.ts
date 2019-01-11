//Javascript fetch API. - https://davidwalsh.name/fetch
//See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch for option for maintaining user session
//See axios or ajax - https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index

//See https://jsonplaceholder.typicode.com/ for placeholder json

//https://stackoverflow.com/questions/29775797/fetch-post-json-data

import UserLoginDetails from '../models/userLoginDetails';

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
    }
}

let loginUser = (userLoginDetails: UserLoginDetails): Promise<string> => {
    let url = "api/Auth/UserLogin";

    return postJson(url, userLoginDetails);
}

export const api = {
    loginUser,
}