import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';
import Helmet from 'react-helmet';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
export class Settings extends React.Component<Props> {
    public render() {
        return <div className="page">
            <Helmet>
                <title>Settings - Training App</title>
                <meta name='description' content='Understand the accessibility features of this web application and toggle on/off a high contrast theme.' />
            </Helmet>

            <div className='page-header'>
                <h1>Settings</h1>
            </div>
            <div className='page-content'>
                <p>Here you will be able to adjust various web accessibility settings and view the accessibility features of this web application.</p>

                <p>Below is a list of accessibility features used on this web application:</p>
                <ul>
                    <li>It is possible to navigate this web application using only a keyboard. Most situations are intuative, however selecting a Radio input can be triky. It is possible to select the apptopriate Radio input using the tab key to get to the correct group, then the arrow keys to select an input. This normal behavior as the Radio groups are treated as a single element in HTML.</li>

                    <li>This web application supports upto 200% browser zoom.</li>

                    <li>A minimum font size of 16px has been used throughout the web application.</li>

                    <li>While this web application uses colours with appropriate contrasts by default, you can also toggle to a high contrast theme using the button below: </li>
                </ul>

                <button className='btn btn-primary theme-button'
                    onClick={
                        this.toggleTheme
                    }
                > High contrast theme toggle
                </button>
            </div>
        </div>;
    }

    private toggleTheme = async (e: any) => {
        this.props.authStore.setUserTheme();
    }
}