//Javascript fetch API. - https://davidwalsh.name/fetch
//See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch for option for maintaining user session
//See axios or ajax - https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index

//See https://jsonplaceholder.typicode.com/ for placeholder json

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

let postJson = async (url: string, body: any) => {
    let responseJson = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body)
    });

    if (responseJson.status === 200) {
        return responseJson.json();
    } else {
        return null;
    }
}

let loginUser = (userLoginDetails: UserLoginDetails): Promise<any> => {
    let url = "api/Auth/UserLogin";
    debugger;
    return postJson(url, userLoginDetails);
}

export const api = {
    loginUser,
}