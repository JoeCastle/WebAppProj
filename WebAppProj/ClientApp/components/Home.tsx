import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { AuthStore } from '../stores/AuthStore/AuthStore';
import { inject, observer } from 'mobx-react';

interface Props extends RouteComponentProps<any>, React.Props<any> {
    authStore: AuthStore
}

@inject('authStore')
@observer
export class Home extends React.Component<Props> {
    async componentDidMount() {
        await this.props.authStore.validateJWT();
    }

    public render() {
        return (<div className="page">
            <h1>Home</h1>
            {
                this.props.authStore.userRole == "trainer" &&
                <TrainerHome {... this.props} />
            }
            {
                this.props.authStore.userRole == "trainee" &&
                <TraineeHome {... this.props} />
            }
            {
                this.props.authStore.userRole == "" &&
                <StandardHome {... this.props} />
            }
        </div>)
    }
}

//Functional components
const StandardHome = (props: Props) => {
    return <div>Home</div>
};

const TrainerHome = (props: Props) => {
    return <div>Trainer home, welcome {props.authStore.username}</div>
};

const TraineeHome = (props: Props) => {
    return <div>Trainee home, welcome {props.authStore.username}</div>
};



//<div className="page">
//    <h1>Hello, world!</h1>
//    <p>Welcome to your new single-page application, built with:</p>
//    <ul>
//        <li><a href='https://get.asp.net/'>ASP.NET Core</a> and <a href='https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx'>C#</a> for cross-platform server-side code</li>
//        <li><a href='https://facebook.github.io/react/'>React</a> and <a href='http://www.typescriptlang.org/'>TypeScript</a> for client-side code</li>
//        <li><a href='https://webpack.github.io/'>Webpack</a> for building and bundling client-side resources</li>
//        <li><a href='http://getbootstrap.com/'>Bootstrap</a> for layout and styling</li>
//    </ul>
//    <p>To help you get started, we've also set up:</p>
//    <ul>
//        <li><strong>Client-side navigation</strong>. For example, click <em>Counter</em> then <em>Back</em> to return here.</li>
//        <li><strong>Webpack dev middleware</strong>. In development mode, there's no need to run the <code>webpack</code> build tool. Your client-side resources are dynamically built on demand. Updates are available as soon as you modify any file.</li>
//        <li><strong>Hot module replacement</strong>. In development mode, you don't even need to reload the page after making most changes. Within seconds of saving changes to files, rebuilt React components will be injected directly into your running application, preserving its live state.</li>
//        <li><strong>Efficient production builds</strong>. In production mode, development-time features are disabled, and the <code>webpack</code> build tool produces minified static CSS and JavaScript files.</li>
//    </ul>
//    <h4>Going further</h4>
//    <p>
//        For larger applications, or for server-side prerendering (i.e., for <em>isomorphic</em> or <em>universal</em> applications), you should consider using a Flux/Redux-like architecture.
//                You can generate an ASP.NET Core application with React and Redux using <code>dotnet new reactredux</code> instead of using this template.
//            </p>
//</div>;
