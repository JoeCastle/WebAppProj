import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import Helmet from 'react-helmet';

export class FourZeroFour extends React.Component<RouteComponentProps<{}>, {}> {
    public render() {
        return <div className='page not-found-page'>
            <Helmet>
                <title>Error 404 Page Not Found - Training App</title>
                <meta name='description' content='Error 404 page not found, sorry please try another page.' />
            </Helmet>

            <div className='page-header'>
                <h1>Error 404 page not found!</h1>
            </div>
            <div className='page-content'>
                <h2>Oops!</h2>
                <p>Page not found, click here to get back to the homepage: <Link to={'/'}>Home</Link></p>
            </div>
        </div>;
    }
}
