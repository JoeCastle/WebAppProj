import './css/site.css';
import './scss/main.scss';
import 'bootstrap';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { BrowserRouter } from 'react-router-dom';
import * as RoutesModule from './routes';
import { useStrict } from 'mobx';
import * as stores from './stores';
import { Provider } from 'mobx-react';

import "isomorphic-fetch";
import "es6-promise/auto";

useStrict(true);

let routes = RoutesModule.routes;

function renderApp() {
    // This code starts up the React app when it runs in a browser. It sets up the routing
    // configuration and injects the app into a DOM element.
    const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href')!;

    ReactDOM.render(
        <Provider {...stores}>
            <AppContainer>
                <BrowserRouter children={routes} basename={baseUrl} />
            </AppContainer>
        </Provider>,
        document.getElementById('react-app')
    );
}
    
    renderApp();
    
    // Allow Hot Module Replacement
if (module.hot) {
    module.hot.accept('./routes', () => {
        routes = require<typeof RoutesModule>('./routes').routes;
        renderApp();
    });
}
