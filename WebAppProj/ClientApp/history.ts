//Creates browser history and allows access to push and other history commands outside of react components.
import createBrowserHistory from 'history/createBrowserHistory';

let browserHistory = createBrowserHistory();
export default browserHistory;