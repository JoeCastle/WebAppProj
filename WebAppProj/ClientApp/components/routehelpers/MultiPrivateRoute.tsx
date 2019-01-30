import * as React from 'react';
import { Route, Redirect, RouteComponentProps, RouteProps } from 'react-router-dom';

////https://stackoverflow.com/questions/49274143/react-typescript-hoc-passing-component-as-the-prop
////https://stackoverflow.com/questions/49379087/how-to-add-typescript-interface-for-a-reactrouters-privateroute
////https://www.google.com/search?rlz=1C1CHBF_en-GBGB755GB755&ei=Kz5BXKXTJKKe1fAP94ub6Ag&q=privateroute+typescript&oq=privateroute+typ&gs_l=psy-ab.3.0.0.1190221.1196157..1197173...0.0..0.96.858.16......0....1..gws-wiz.......0i71j0i131j0i67j0i10j0i22i30.f2Y56oVyhJE

interface Props extends RouteProps {
    //component: new (props: any) => React.Component;
    component: any;
    component2: any;
}

export const MultiPrivateRoute = (props: Props) => {

    let { component: Component, component2: Component2, ...rest } = props;

    //debugger;

    return (
        <Route {...rest} render={(props) => {
            var userJSON = JSON.parse(localStorage.getItem('userDetails') || '{}');

            //debugger;

            if (Object.keys(userJSON).length != 0) {
                if (userJSON.user.userRole == 'Trainer') {
                    return <Component {...props} />
                } else if (userJSON.user.userRole == 'Trainee') {
                    return <Component2 {...props} />
                } else {
                    return <Redirect to={{
                        pathname: '/login',
                        state: { from: props.location }
                    }} />
                }
            } else {
                return <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            }
        }}
        />
    );
};