import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { WebSocketLink } from 'apollo-link-ws';
import { createUploadLink } from 'apollo-upload-client';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

const cache = new InMemoryCache()

const uploadLink = createUploadLink({ 
    uri: process.env.REACT_APP_API,
    credentials: 'same-origin'
});

const wsLink = new WebSocketLink({
    uri: process.env.REACT_APP_WEBSOCKET,
    options: {
      reconnect: true,
      connectionParams: {
        token: localStorage.getItem('token') ? `${localStorage.getItem('token')}` : "",
      }
    }
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            token: localStorage.getItem('token') ? `${localStorage.getItem('token')}` : "",
        }
    }
});

const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    authLink.concat(uploadLink),
);

const apolloClient = new ApolloClient({
    link: link,
    cache: cache
});

export default apolloClient