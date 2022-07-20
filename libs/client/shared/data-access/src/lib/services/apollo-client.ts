
import { useMemo } from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { asyncMap, getMainDefinition } from '@apollo/client/utilities';
import { GraphqlErrorCode } from '../graphql';
import { shuffle } from 'lodash';
import { GraphqlMutations } from '@els/client/app/shared/data-access';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { cross_kratos, logoutKratos } from '@els/client/shared/data-access';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import { createHttpLink } from 'apollo-link-http';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

// ? note: ServiceName = Browser when using apolloClient on client side, ServiceName = Server when using apolloClient on server side
export const ServiceName = {
  Browser: 'Browser',
  Server: 'Server',
};

// * use with federation
const httpLinkServer = new HttpLink({
  uri: publicRuntimeConfig.HTTP_LINK_SERVER,
  credentials: 'include',
});

const httpLinkBrowser = new HttpLink({
  uri: publicRuntimeConfig.HTTP_LINK_BROWSER,
  credentials: 'include',
});

//* need to consider before apply, because it just use GET method with a long string query that make some problems for proxy
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpLinkBrowserHash = createPersistedQueryLink({
  useGETForHashedQueries: true,
}).concat(
  createHttpLink({
    uri: publicRuntimeConfig.HTTP_LINK_BROWSER,
    credentials: 'include',
  })
);

//* need to consider before apply, because it just use GET method with a long string query that make some problems for proxy
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const httpLinkServerHash = createPersistedQueryLink({
  useGETForHashedQueries: true,
}).concat(
  createHttpLink({
    uri: publicRuntimeConfig.HTTP_LINK_SERVER,
    credentials: 'include',
  })
);

const graphqlLinks = ApolloLink.split(
  (operation) => operation.getContext().serviceName === ServiceName.Server,
  httpLinkServer as any,
  httpLinkBrowser as any
);

const wsLink =(
  typeof window !== 'undefined'
    ? window.location.origin !== publicRuntimeConfig.GUARDIAN_URL
      ? new WebSocketLink(
        new SubscriptionClient(publicRuntimeConfig.WS_LINK, {
          reconnect: true,
        })
      )
      : undefined
    : undefined);

const graphqlEndpoints = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind !== 'OperationDefinition' ||
      definition.operation !== 'subscription'
    );
  },
  graphqlLinks,
  wsLink
);

let apolloClient: ApolloClient<any>;

const handleLogout = async (): Promise<void> => {
  const currentToken = localStorage.getItem('tokenDevice');

  //* delete device token
  if (currentToken) {
    await apolloClient.mutate({
      mutation: GraphqlMutations.LearningMutations.Device.DeleteDevice,
      variables: {
        deleteDeviceInput: {
          token: currentToken,
        },
      },
    });
  }

  await logoutKratos(apolloClient, cross_kratos);
};

// * custom request headers
const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => {
    return {
      headers: {
        ...headers,
      },
    };
  });

  return forward(operation);
});

// * handle if error
const errorResponse = onError(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ graphQLErrors, networkError, response, operation, forward }: any) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        switch (err.extensions.code) {
          case GraphqlErrorCode.UNAUTHORIZED_ERROR:
            response.errors = null;
            break;

          case GraphqlErrorCode.INTERNAL_SERVER_ERROR:
            switch (err.extensions.exception.status) {
              case 403:
                response.errors = null;
                handleLogout();
                break;
              case 401:
                response.errors = null;
                handleLogout();
                break;
            }
            break;
        }
      }
    }

    // To retry on network errors, we recommend the RetryLink
    // instead of the onError link. This just logs the error.
    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

// * custom response data
const dataResponse = new ApolloLink((operation, forward) => {
  return asyncMap(forward(operation), async (response) => {
    // ? note: Random sort the choices of the question
    if (response.data?.questions !== undefined) {
      const customResponse = {
        ...response,
        data: {
          ...response.data,
          questions: response.data.questions.map((item: any) => {
            const newItem = {
              ...item,
              choices: JSON.stringify(shuffle(JSON.parse(item.choices))),
            };

            return newItem;
          }),
        },
      };

      return customResponse;
    }

    return response;
  });
});

const paramApolloClient = {
  link: ApolloLink.from([
    authMiddleware,
    dataResponse,
    errorResponse,
    graphqlEndpoints,
  ]),
  // link: httpLinkServerHash,
  ssrMode: typeof window === 'undefined', // set to true for SSR
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          //* custom for select fields from reference when not query yet
          // employee: {
          //   read(_, { args, toReference }) {
          //     return toReference({
          //       __typename: "Employee",
          //       id: args.id,
          //     });
          //   },
          // },

          //* lazy load topics
          topics: {
            keyArgs: false,
            merge(existing, incoming, { args }) {
              // ? note: custom follow apolloClient (https://www.apollographql.com/docs/react/pagination/core-api)
              if (args) {
                // not merged existing when reload data
                if (args.pageNumber === 1 || args.pageNumber === undefined)
                  return incoming?.nodes ?? [];

                // merged existing when load more data
                const merged = existing ? existing.slice(0) : [];
                if (incoming?.nodes?.length) {
                  for (let i = 0; i < incoming?.nodes?.length; ++i) {
                    merged[(args.pageNumber - 1) * args.limit + i] =
                      incoming.nodes[i];
                  }
                }
                return merged;
              } else {
                return [...existing, ...incoming.nodes];
              }
            },
          },
        },
      },
    },
  }),
  default: { // ? note: read document apolloClient (https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy)
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  credentials: 'include', // Enable sending cookies over cross-origin requests (Not work with multiple httpLink)
};
const createApolloClient = () => new ApolloClient(paramApolloClient);

// eslint-disable-next-line @typescript-eslint/ban-types
export const initializeApollo = (initialState: object | null = null) => {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState });
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
};

export function addApolloState(
  client: { cache: { extract: () => any } },
  pageProps: { props: { [x: string]: any } }
) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export const useApollo = (pageProps: { [x: string]: any }) => {
  const initialState = pageProps?.[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(initialState), [initialState]);

  return store;
};

// ? note: custom apollo client follow (https://github.com/borisowsky/next-advanced-apollo-starter/blob/master/src/lib/apollo.tsx)
