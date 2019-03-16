import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { RouteContainer } from './components/RouteContainer';

export const routes = <Layout>
    <Route path='/' render={(props: any) => <RouteContainer {...props} />} />
</Layout>;
