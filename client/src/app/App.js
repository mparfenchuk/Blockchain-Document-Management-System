import React, { Component, Suspense } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { ApolloProvider } from "react-apollo";
import { SnackbarProvider } from 'notistack';
import { MuiThemeProvider } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import Loader from './components/Loader';

import { PublicRoute, PrivateRoute } from './routes'

import { Auth, Default } from './layout'

import apolloClient from './apollo'

import "moment/locale/uk";

import theme from './theme'

import Main from '../main';
import Login from '../login';
import SignUp from '../signup';
import Profile from '../profile';
import Documents from '../documents';
import Document from '../document';
import Employees from '../employees';
import Employee from '../employee';
import Templates from '../templates';

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <ApolloProvider client={apolloClient}>
                    <MuiThemeProvider theme={theme}>
                        <CssBaseline />
                        <SnackbarProvider maxSnack={3}>
                            <Switch>
                                <Suspense fallback={<Loader />}>
                                    <PublicRoute 
                                        path="/" 
                                        exact 
                                        component={Main}
                                        layout={Default}
                                        redirectTo="/profile"
                                    />
                                    <PublicRoute 
                                        path="/signup" 
                                        exact 
                                        component={SignUp}
                                        layout={Default}
                                        redirectTo="/profile"
                                    />
                                    <PublicRoute 
                                        path="/login" 
                                        exact 
                                        component={Login}
                                        layout={Default}
                                        redirectTo="/profile"
                                    />
                                    <PrivateRoute 
                                        path="/profile" 
                                        exact 
                                        component={Profile}
                                        layout={Auth}
                                        redirectTo="/login"
                                    />
                                    <PrivateRoute 
                                        path="/documents" 
                                        exact 
                                        component={Documents}
                                        layout={Auth}
                                        redirectTo="/login"
                                    />
                                    <PrivateRoute 
                                        path="/document/:id" 
                                        exact 
                                        component={Document}
                                        layout={Auth}
                                        redirectTo="/login"
                                    />
                                    <PrivateRoute 
                                        path="/employees" 
                                        exact 
                                        component={Employees}
                                        layout={Auth}
                                        redirectTo="/login"
                                    />
                                    <PrivateRoute 
                                        path="/employee/:id" 
                                        exact 
                                        component={Employee}
                                        layout={Auth}
                                        redirectTo="/login"
                                    />
                                    <PrivateRoute 
                                        path="/templates" 
                                        exact 
                                        component={Templates}
                                        layout={Auth}
                                        redirectTo="/login"
                                    />
                                </Suspense>
                            </Switch>
                        </SnackbarProvider>
                    </MuiThemeProvider>
                </ApolloProvider>
            </BrowserRouter>
        );
    }
}

export default App;