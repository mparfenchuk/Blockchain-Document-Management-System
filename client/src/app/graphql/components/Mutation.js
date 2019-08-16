import React, { PureComponent } from 'react';

import { Mutation, withApollo } from 'react-apollo';
import { withRouter } from 'react-router-dom';
import { withSnackbar } from 'notistack';

import logout from '../../helpers/logout';

class CustomMutation extends PureComponent {

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
            <Mutation
                onError={this.checkError} 
                {...props}
            >
                {(mutate, result) => (
                    children(mutate, result)
                )}
            </Mutation>
        )
    }
}

export default withRouter(withApollo(withSnackbar(CustomMutation)))
