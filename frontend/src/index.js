import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App2 from './App';
import * as serviceWorker from './serviceWorker';
import {ApolloClient, InMemoryCache, HttpLink, ApolloLink} from 'apollo-boost';
import {onError} from 'apollo-link-error';
import {RetryLink} from 'apollo-link-retry';
import SerializingLink from 'apollo-link-serialize';
import QueueLink from 'apollo-link-queue';
import {ApolloProvider} from '@apollo/react-hooks';
import {persistCache} from "apollo-cache-persist";
import {restoreRequests} from "./useOfflineMutation";

const retry = new RetryLink({attempts: {max: Infinity}, delay:{jitter: true}});
export const queueLink = new QueueLink();
const serializingLink = new SerializingLink();
const http = new HttpLink({uri: 'http://localhost:4000/graphql'});
const cache = new InMemoryCache();
const waitForCache = persistCache({cache, storage: window.localStorage});
const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.map(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({cache, link: ApolloLink.from([errorLink, queueLink, serializingLink, retry, http])});


const App = () => (
    <ApolloProvider client={client}>
        <App2/>
    </ApolloProvider>
);

waitForCache.then(() => {
    restoreRequests(client);
    ReactDOM.render(<App/>, document.getElementById('root'))
});


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
