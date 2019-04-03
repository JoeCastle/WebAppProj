import * as React from 'react';
import { Route, Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';
import { Component } from 'react';

////https://stackoverflow.com/questions/49274143/react-typescript-hoc-passing-component-as-the-prop
////https://stackoverflow.com/questions/49379087/how-to-add-typescript-interface-for-a-reactrouters-privateroute
////https://www.google.com/search?rlz=1C1CHBF_en-GBGB755GB755&ei=Kz5BXKXTJKKe1fAP94ub6Ag&q=privateroute+typescript&oq=privateroute+typ&gs_l=psy-ab.3.0.0.1190221.1196157..1197173...0.0..0.96.858.16......0....1..gws-wiz.......0i71j0i131j0i67j0i10j0i22i30.f2Y56oVyhJE
//interface Props extends RouteComponentProps<any>, React.Props<any> {
//    //component: React.Component; //Does not have construct or call signitures
//    component: new (props: any) => React.Component;
//}

////Might require 2 of these components, one for 1 component, one for 2, or pass in array of components

//const userRole = true;
//const isLoggenIn = "";

//debugger;

//export const PrivateRoute = ({ component: Component, ...rest }:Props) => (
//    <Route {...rest} render={props => (
//        userRole ? (
//            <Component {...props} />
//        ) : (
//                <Redirect to={{
//                    pathname: '/login',
//                    state: { from: props.location }
//                }} />
//            )
//    )} />
//)

//------------------------

//Works
interface Props extends RouteProps {
    //component: new (props: any) => React.Component;
    component: any;
    roleRequired: string;
    path: string;
}

export const PrivateRoute = (props: Props) => {

    let { component: Component, roleRequired: RoleRequired, path: Path, ...rest } = props;

    var userJSON = JSON.parse(localStorage.getItem('userDetails') || '{}');

    let isloggedIn = Object.keys(userJSON).length != 0 ? true : false;
    let isTrainer = false;
    let isTrainee = false;
    let isRoleRequired = false;

    if (isloggedIn) {
        isTrainer = userJSON.user.userRole == 'trainer' ? true : false;
        isTrainee = userJSON.user.userRole == 'trainee' ? true : false;

        if (RoleRequired == userJSON.user.userRole) {
            isRoleRequired = true;
        }
    }

    //debugger;

    //if (Object.keys(userJSON).length != 0) {
    //    return <Redirect to={{
    //        pathname: '/login',
    //        state: { from: props.location }
    //    }} />
    //} else {
    //    return <Component {...props} />
    //}

    //<Route {...rest} render={(props) => (
    //    isRoleRequired === true
    //        ? <Component {...props} />
    //        : <Redirect to={{
    //            pathname: '/login',
    //            state: { from: props.location }
    //        }} />
    //)} />

    //<Route {...rest} path={Path} render={(props: any) => {
    //    if (isRoleRequired) {
    //        return <Component {...props} />
    //    } else {
    //        return <Redirect to={{
    //            pathname: '/',
    //            state: { from: props.location }
    //        }} />
    //    }
    //}} />

    

    if (isloggedIn) {
        if (isRoleRequired) {
            return <Component {...props} />
        } else {
            return <Redirect to={{
                pathname: '/',
                state: { from: props.location }
            }} />
        }
    } else {
        return <Redirect to={{
            pathname: '/login',
            state: { from: props.location }
        }} />
    }

};


//export function PrivateRoute({ Component, RoleRequired, ...rest }: { Component: React.ComponentType<any>, RoleRequired: string }) {
//    var userJSON = JSON.parse(localStorage.getItem('userDetails') || '{}');

//    let isloggedIn = Object.keys(userJSON).length != 0 ? true : false;
//    let isTrainer = false;
//    let isTrainee = false;
//    let isRoleRequired = false;

//    if (isloggedIn) {
//        isTrainer = userJSON.user.userRole == 'trainer' ? true : false;
//        isTrainee = userJSON.user.userRole == 'trainee' ? true : false;

//        if (RoleRequired == userJSON.user.userRole) {
//            isRoleRequired = true;
//        }
//    }

//    return (
//        <Route
//            {...rest}
//            render={props =>
//                isRoleRequired ? (
//                    <Component {...props} />
//                ) : (
//                        <Redirect
//                            to={{
//                                pathname: "/login",
//                                state: { from: props.location }
//                            }}
//                        />
//                    )
//            }
//        />
//    );
//}
