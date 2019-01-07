import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

export class FourZeroFour extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div className="page">
            <h1>Error 404!</h1>
            <p>You're lost, click here to get back to the homepage: </p>
            <Link to={'/'}>
                <span className='glyphicon glyphicon-home'></span> Home
            </Link>
            
        </div>;
    }
}
