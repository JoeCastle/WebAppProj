import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

export class FourZeroFour extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div className="page">
            <div className='page-header'>
                <h1>Error 404 page not found!</h1>
            </div>
            <div className='page-content'>
                <h2>Oops!</h2>
                <p>Page not found, click here to get back to the homepage: </p>
                <Link to={'/'}>
                    <span className='glyphicon glyphicon-home'></span> Home
            </Link>
            </div>
        </div>;
    }
}
