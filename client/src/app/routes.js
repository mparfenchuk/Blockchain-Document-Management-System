import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import isAuthenticated from './helpers/checkAuth'

const PrivateRoute = ({ component: Component, layout: Layout, redirectTo, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (isAuthenticated() ? (
                <Layout>
                    <Component {...props} />
                </Layout>
            ) : (
                <Redirect
                    to={{
                        pathname: redirectTo,
                    }}
                />
            ))
        }
    />
);

const PublicRoute = ({ component: Component, layout: Layout, redirectTo, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            (!isAuthenticated() ? (
                <Layout>
                    <Component {...props} />
                </Layout>
            ) : (
                <Redirect
                    to={{
                        pathname: redirectTo,
                    }}
                />
            ))
        }
    />
);

export {
    PublicRoute,
    PrivateRoute
}