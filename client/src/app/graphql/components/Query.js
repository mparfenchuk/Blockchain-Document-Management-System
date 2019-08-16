import React, { PureComponent } from 'react';

import { Query, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';

import logout from '../../helpers/logout';

class CustomQuery extends PureComponent {

    checkError = async ({ networkError, graphQLErrors }) => {
        let { enqueueSnackbar, history, client } = this.props

        if (networkError) {
            return enqueueSnackbar(networkError.message, { 
              variant: 'error',
            })
        }

        if (graphQLErrors) {
            for (let error of graphQLErrors) {
              
                if (error.extensions.code === "UNAUTHENTICATED") {
                    await logout(client, history)
                    return enqueueSnackbar(error.message, { 
                      variant: 'error',
                    })
                }

                return enqueueSnackbar(error.message, { 
                    variant: 'error',
                })
            }
        }
    }

    render() {

        const { children, ...props } = this.props

        return(
            <Query 
                onError={this.checkError} 
                {...props}
            >
                {result => (
                    children(result)
                )}
            </Query>
        )
    }
}

export default withRouter(withApollo(withSnackbar(CustomQuery)))
