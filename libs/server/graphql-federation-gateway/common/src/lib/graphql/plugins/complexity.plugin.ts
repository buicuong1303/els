import { GraphQLSchemaHost, Plugin } from '@nestjs/graphql';
import {
  ApolloServerPlugin,
  GraphQLRequestListener,
} from 'apollo-server-plugin-base';

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
  constructor(private gqlSchemaHost: GraphQLSchemaHost) {}

  requestDidStart(): GraphQLRequestListener {
    return {
      willSendResponse({ context, response }) {
        // Append our final result to the outgoing response headers
        response?.http?.headers.set(
          'Server-Id',
          context.serverIds.join(',')
        );
      }
    };
  }
}
