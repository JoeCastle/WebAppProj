import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps<any>, React.Props<any> {
}

export class About extends React.Component<Props> {
    public render() {
        return <div className="page">
            <h1>Hello, welcome to my web application!</h1>
            <p>This is the about page.</p>

            <p>I will talk about:</p>
            <ul>
                <li>Me and my degree.</li>
                <li>This project / my dissertation.</li>
                <li>Web acessibility in general.</li>
                <li>Web acessibility on this site.</li>
                <li>What you can do on this site.</li>
            </ul>
        </div>;
    }
}