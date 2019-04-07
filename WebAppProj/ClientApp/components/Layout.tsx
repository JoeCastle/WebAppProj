import * as React from 'react';
import DevTools from 'mobx-react-devtools'

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return <div className='container-fluid'>
            {this.props.children}
            {/*<DevTools />*/}
        </div>;
    }
}
