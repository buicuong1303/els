/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { GqlModuleOptions, GqlOptionsFactory, NextFn } from '@nestjs/graphql';
import { corsApolloOptions } from './cors.config';
import { join } from 'path';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginInlineTraceDisabled,
} from 'apollo-server-core';

import { GqlContext, GuardianGrpcServiceClient, Identity } from '@els/server/shared';
import { RedisCache } from 'apollo-server-cache-redis';
import { redisOptions } from '.';

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(private _guardianGSC: GuardianGrpcServiceClient) {}
  createGqlOptions(): GqlModuleOptions {
    const cache = new RedisCache(redisOptions);
    return {
      debug: true,
      // playground: false,
      autoSchemaFile: join(process.cwd(), 'gql-schema/guardian.gql'), //* guardian will using src/guardian-schema.gql
      sortSchema: true,
      cache,
      // transformSchema: (schema: GraphQLSchema) => { //* run after middleware and context
      //   schema = applyMiddleware(schema);
      //   return schema;
      // },
      cors: corsApolloOptions,
      // autoTransformHttpErrors: true,
      useGlobalPrefix: true,
      // cache,
      // resolvers,
      // typeDefs,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault(),
        // ApolloServerPluginInlineTrace(), //TODO: need confirm
        ApolloServerPluginInlineTraceDisabled,
      ],
      persistedQueries: {
        cache,
      },
      // schemaDirectives: {},
      fieldResolverEnhancers: ['guards'], //['interceptors', 'filters']

      context: ({ payload, connection, request, reply }) => {
        const identity = new Identity(request, reply);

        const ctx: GqlContext = {
          cache,
          req: {
            ...request,
            identity
          },
          res: reply,
          payload,
          connection,
          rpc: {
            guardian: this._guardianGSC,
          },
        };
        return ctx;
      },

      formatError: (err) => {
        // Don't give the specific errors to the client.
        if (err.message.startsWith('Database Error')) {
          return new Error('Internal server error');
        }
        // Otherwise return the original error. The error can also
        // be manipulated in other ways, as long as it's returned.
        return err;
      },
    };
  }
}
