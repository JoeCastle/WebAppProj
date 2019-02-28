import * as React from 'react';
import { RouteComponentProps } from 'react-router';

interface Props extends RouteComponentProps<any>, React.Props<any> {
}

export class Settings extends React.Component<Props> {
    public render() {
        return <div className="page">
            <div className='page-header'>
                <h1>Settings</h1>
            </div>
            <div className='page-content'>
                <p>Here you will be able to adjust various web accessibility settings.</p>

                <p>You will be able to change or adjust:</p>
                <ul>
                    <li>Font type (maybe font size).</li>
                    <li>High contrast theme.</li>
                    <li>Etc.</li>
                </ul>
            </div>
        </div>;
    }
}