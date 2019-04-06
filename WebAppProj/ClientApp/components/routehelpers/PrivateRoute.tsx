import * as React from 'react';
import { Route, Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';
import { Component } from 'react';

interface Props extends RouteProps {
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
