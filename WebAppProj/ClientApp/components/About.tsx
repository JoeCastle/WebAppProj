import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

interface Props extends RouteComponentProps<any>, React.Props<any> {
}

export class About extends React.Component<Props> {
    public render() {
        return <div className="page">
            <Helmet>
                <title>About Website - Training App</title>
                <meta name='description' content='The about page, where you can learn the content and purpose of the website.' />
            </Helmet>

            <div className='page-header'>
                <h1>Hello, welcome to my web application!</h1>
            </div>
            <div className='page-content'>
                <h2>My project and dissertation</h2>
                <p>This web application was developed as part of my final year project for my BSc (Hons) Computer Science (Software Engineering) course. The focus of my dissertation was web accessibility and this web application was developed to support my findings.</p>
                <p>For a full list of features, go to the <Link to={'/'}>Home</Link> page.</p>

                <h2>Web accessibility</h2>
                <p>The web application has been developed with web accessibility in mind, specifically the Web Content Accessibility Guidelines (WCAG) 2.1. Accessibility is described in more depth on the <Link to={'/settings'}>Settings</Link> page where you can also adjust the theme.</p>
            </div>
        </div>;
    }
}