import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { Module } from '@nestjs/common';
import { GATEWAY_BUILD_SERVICE, GraphQLGatewayModule } from '@nestjs/graphql';
import { corsWhiteList } from '@els/server/graphql-federation-gateway/common';

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
    const { sessionToken, sessionCookie } = context;
    if (sessionToken) {
      request.http.headers.set('Authorization', `Bearer ${sessionToken}`);
    } else {
      request.http.headers.append('Set-Cookie', sessionCookie);
    };
  };

  //* forward file upload for microservice
  async process(args) {
    args.request.variables = args.request.variables || {};
    if (args.request.variables.file) {
      const { createReadStream } = args.request.variables.file.file;
      const stream = createReadStream();
      const chunks = [];

      for await (const chunk of stream) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      args.request.variables.file = {
        file: {
          ...args.request.variables.file.file,
          buffer: buffer,
        },
      };
    }
    return super.process(args);
  }

  //* set cookie for willSendResponse
  didReceiveResponse({ response, context }) {
    const cookie = response.http.headers.get('Set-Cookie') as string | null;

    if (cookie) {
      context.cookie = cookie;
    }

    return response;
  }
}

@Module({
  providers: [
    {
      provide: AuthenticatedDataSource,
      useValue: AuthenticatedDataSource,
    },
    {
      provide: GATEWAY_BUILD_SERVICE,
      useFactory: async (AuthenticatedDataSource) => {
        return ({ url }) => new AuthenticatedDataSource({ url });
      },
      inject: [AuthenticatedDataSource],
    },
  ],
  exports: [GATEWAY_BUILD_SERVICE],
})
class BuildServiceModule {}

@Module({
  imports: [
    GraphQLGatewayModule.forRootAsync({
      useFactory: async () => ({
        gateway: {
          // buildService: ({ url }) => new FileUploadDataSource({ url }),
          serviceList: [
            /* services */
            { name: 'learning', url: process.env.SUBGRAPH_LEARNING_ENDPOINT },
            { name: 'dictionary', url: process.env.SUBGRAPH_DICTIONARY_ENDPOINT },
            { name: 'guardian', url: process.env.SUBGRAPH_GUARDIAN_ENDPOINT },
          ],
        },
        server: {
          context: ({ request }) => {
            //* can set user-id, tenant-id,...
            //* get cookie or token bearer at here, pass to context
            //* get client info like browser, ip,..
            if (request.cookies?.idToken) {
              return {
                cache: 'Check',
                sessionToken: request.cookies.idToken,
                cookie: '', //* tempt
              };
            }
            const authToken = (request.headers['Authorization'] ??
              request.headers['authorization']) as string;

            if (authToken && authToken.startsWith('Bearer ')) {
              const sessionToken = authToken.substr(7, authToken.length);

              return {
                cache: 'Check',
                sessionToken,
                cookie: '', //* tempt
              };
            }

            //*Set cookie
            if(request.cookies?.ory_kratos_session) {
              let hasKey = false;
              let stringCookies = '';
              const listKey = Object.keys(request.cookies);
              listKey.forEach(item => {
                if(item.includes('csrf_token')){
                  hasKey = true;
                  if(stringCookies) {
                    stringCookies = `${stringCookies};${item}=${request.cookies[item]}`;
                  } else {
                    stringCookies = `${item}=${request.cookies[item]}`;
                  };
                } else {
                  if(stringCookies) {
                    stringCookies = `${stringCookies};${item}=${request.cookies[item]}`;
                  } else {
                    stringCookies = `${item}=${request.cookies[item]}`;
                  };
                };
              });
              if(hasKey) {
                return {
                  cache: 'Check',
                  sessionCookie: stringCookies
                };
              };
            };
          },
          plugins: [
            {
              async requestDidStart() {
                return {
                  async willSendResponse({ context, response, request }) {
                    let { cookie } = context; //* from didReceiveResponse
                    const { sessionToken } = context;

                    if (
                      corsWhiteList.includes(request.http.headers.get('origin'))
                    ) {
                      response.http.headers.append(
                        'Access-Control-Allow-Origin',
                        request.http.headers.get('origin')
                      );
                    }

                    response.http.headers.append(
                      'Access-Control-Allow-Credentials',
                      'true'
                    );

                    if (!cookie) {
                      if (sessionToken) {
                        cookie = `idToken=${sessionToken}; Domain=${process.env.WILDCARD_DOMAIN}; Path=/; HttpOnly`;
                      } else {
                        return;
                      }
                    }
                    //* append our final result to the outgoing response headers
                    response.http.headers.append('Set-Cookie', cookie);
                  },
                };
              },
            },
          ],
        },
      }),
      imports: [BuildServiceModule],
      inject: [GATEWAY_BUILD_SERVICE],
    }),
  ],
})
export class CoreModule {}
