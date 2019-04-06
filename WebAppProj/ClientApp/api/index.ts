import UserLoginDetails from '../models/userLoginDetails';
import UserRegisterDetails from '../models/userRegisterDetails';
import CurrentUserDetails from '../models/currentUserDetails';
import CreateGroupDetails from '../models/createGroupDetails';
import UserDetails from '../models/userDetails';
import CreateQuizDetails from '../models/CreateQuiz/createQuizDetails';
import QuizDetails from '../models/GetQuiz/quizDetails';
import TraineeGetQuizzes from '../models/traineeGetQuizzes';
import SubmitQuizResultsDetails from '../models/submitQuizResultsDetails';
import TraineeGetQuizResults from '../models/traineeGetQuizResults';
import QuizResults from '../models/GetQuizResults/quizResults';
import TraineeByQuizDetails from '../models/TraineeByQuizDetails';

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
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (responseJson.status === 200) {
        return responseJson.json();
    } else {
        return null;
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

let postJsonBearer = async (url: string, body: any) => {
    var userJSON = JSON.parse(localStorage.getItem('userDetails') || '{}');
    let bearer;
    if (Object.keys(userJSON).length != 0) {
        bearer = 'Bearer ' + userJSON.user.jwt;
    } else {
        var token = '';
        bearer = 'Bearer ' + token;
    }  

    let responseJson = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': bearer,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    if (responseJson.status === 200) {
        return responseJson.json();
    } else {
        return null;
    }
}

//Replace with get?
let postJsonBearerNoBody = async (url: string) => {
    var userJSON = JSON.parse(localStorage.getItem('userDetails') || '{}');
    let bearer;
    if (Object.keys(userJSON).length != 0) {
        bearer = 'Bearer ' + userJSON.user.jwt;
    } else {
        var token = '';
        bearer = 'Bearer ' + token;
    }

    let responseJson = await fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': bearer,
            'Content-Type': 'application/json'
        }
    });

    if (responseJson.status === 200) {
        return responseJson.json();
    } else {
        return null;
    }
}

let addUsersToGroup = (usersToAddToGroup: any): Promise<Response> => {
    let url = "api/Group/AddUsersToGroup";

    return postJsonBearer(url, usersToAddToGroup);
}

let createGroup = (createGroupDetails: CreateGroupDetails): Promise<Response> => {
    let url = "api/Group/CreateGroup";

    return postJsonBearer(url, createGroupDetails);
}

let createQuiz = (createQuizDetails: CreateQuizDetails): Promise<Response> => {
    let url = "api/Quiz/CreateQuiz";

    return postJsonBearer(url, createQuizDetails);
}

let getAllQuizzesforGroup = (groupID: number): Promise<QuizDetails[]> => {
    let url = "api/Quiz/GetAllQuizzesforGroup";

    return postJsonBearer(url, groupID);
}

let getCurrentGroupDetails = (groupID: number): Promise<Response> => {
    let url = "api/Group/GetCurrentGroupDetails";

    return postJsonBearer(url, groupID);
}

let getCurrentGroupUsers = (groupID: number): Promise<UserDetails[]> => {
    let url = "api/Group/GetUsersInGroup";

    return postJsonBearer(url, groupID);
}

let getUncompletedQuizzesForTrainee = (userAndGroupIDDTO: TraineeGetQuizzes): Promise<QuizDetails[]> => {
    let url = "api/Quiz/GetUncompletedQuizzesForTrainee";

    return postJsonBearer(url, userAndGroupIDDTO);
}

let getCompletedQuizzesForTrainee = (userAndGroupIDDTO: TraineeGetQuizzes): Promise<QuizDetails[]> => {
    let url = "api/Quiz/GetCompletedQuizzesForTrainee";

    return postJsonBearer(url, userAndGroupIDDTO);
}

let getUsersNotInGroup = (): Promise<UserDetails[]> => {
    let url = "api/Group/GetUsersNotInGroup";

    return postJsonBearerNoBody(url);
}

let getQuizByQuizID = (quizID: number): Promise<QuizDetails> => {
    let url = "api/Quiz/GetQuizByQuizID";

    return postJsonBearer(url, quizID);
}

let getQuizResults = (traineeGetQuizResultsDDTO: TraineeGetQuizResults): Promise<QuizResults> => {
    let url = "api/Quiz/GetQuizResults";

    return postJsonBearer(url, traineeGetQuizResultsDDTO);
}

let getTraineesResultsByQuizID = (quizID: number): Promise<TraineeByQuizDetails[]> => {
    let url = "api/Result/GetTraineesResultsByQuizID";

    return postJsonBearer(url, quizID);
}

let loginUser = (userLoginDetails: UserLoginDetails): Promise<CurrentUserDetails> => {
    let url = "api/Auth/UserLogin";

    return postJson(url, userLoginDetails);
}

let registerUser = (userResigterDetails: UserRegisterDetails): Promise<boolean> => {
    let url = "api/Auth/UserRegister";

    return postJson(url, userResigterDetails);
}

let removeUsersFromGroup = (removeUsersFromGroup: any): Promise<Response> => {
    let url = "api/Group/RemoveUsersFromGroup";

    return postJsonBearer(url, removeUsersFromGroup);
}

let submitQuizResults = (submitQuizResultsDetails: SubmitQuizResultsDetails[]): Promise<Response> => {
    let url = "api/Quiz/SubmitQuizResults";

    return postJsonBearer(url, submitQuizResultsDetails);
}

let verifyJWT = (jsonWebToken: string): Promise<CurrentUserDetails> => {
    let url = "api/Auth/VerifyJWT";

    return postJson(url, jsonWebToken);
}

export const api = {
    addUsersToGroup,
    createGroup,
    createQuiz,
    getAllQuizzesforGroup,
    getCurrentGroupDetails,
    getCurrentGroupUsers,
    getUncompletedQuizzesForTrainee,
    getCompletedQuizzesForTrainee,
    getUsersNotInGroup,
    getQuizByQuizID,
    getQuizResults,
    getTraineesResultsByQuizID,
    loginUser,
    registerUser,
    removeUsersFromGroup,
    submitQuizResults,
    verifyJWT,
}