import * as React from 'react';
import { NavMenu } from './NavMenu';
//import DevTools from 'mobx-react-devtools'

export interface LayoutProps {
    children?: React.ReactNode;
}

export class Layout extends React.Component<LayoutProps, {}> {
    public render() {
        return <div className='container-fluid'>
            
                
                    <NavMenu />
                
                
                    { this.props.children }
                
            
            {/*<DevTools />*/}
        </div>;
    }
}
