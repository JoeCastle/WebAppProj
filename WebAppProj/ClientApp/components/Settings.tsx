import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
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

                <button className='btn btn-primary theme-button'
                    onClick={
                        this.toggleTheme
                    }
                > Switch to high contrast theme
                </button>
            </div>
        </div>;
    }

    private toggleTheme = async (e: any) => {
        this.props.authStore.setUserTheme();
    }
}