import { GqlContextExpress as SharedGqlContext, GuardianGrpcServiceClient, IRequest, IResponse } from '@els/server/shared';
import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import {
  ApolloServerPluginInlineTraceDisabled, ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core';
import { GraphQLSchema } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { join } from 'path';
import { Identity } from '../guards';
import { corsApolloOptions } from './cors.config';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import * as Redis from 'ioredis';
import { redisOptions } from './redis.config';

export interface GqlContext extends SharedGqlContext{
  cache: BaseRedisCache,
  //* express
  // req?: Partial<IRequest>;
  // res?: Partial<ExpressResponse>
  req?: IRequest;
  res?: IResponse
  payload: any;
  connection?: any;
  rpc: {
    guardian:GuardianGrpcServiceClient,
  },
  identity: Identity
}

export interface GqlModuleOptionsSubscription extends GqlModuleOptions{
  subscriptions?: {
    onConnect?: any
  }
}

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private readonly _guardianGSC: GuardianGrpcServiceClient,
  ) {}

  createGqlOptions(): GqlModuleOptionsSubscription {
    const cache = new BaseRedisCache({
      client: new Redis(redisOptions)
    });

    return {
      debug: true,
      // playground: false,
      autoSchemaFile: join(process.cwd(), 'gql-schema/graphql-subscription.gql'), //* guardian will using src/guardian-schema.gql
      sortSchema: true,

      transformSchema: (schema: GraphQLSchema) => { //* run after middleware
        schema = applyMiddleware(schema);
        return schema;
      },
      installSubscriptionHandlers: true,

      cors: corsApolloOptions,
      // autoTransformHttpErrors: true,
      useGlobalPrefix: true,
      cache,
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

      context:  ( {payload, connection} ) => {
        const ctx: GqlContext = {
          cache,
          payload: payload,
          connection: connection,
          rpc: {
            guardian: this._guardianGSC,
          },
          identity: new Identity(connection)
        };

        return ctx;
      },

      subscriptions: {
        onConnect: (connectionParams: any, webSocket: any) => {
          return {
            connectionParams,
            headers: webSocket['upgradeReq']['headers']
          };
        }
      },

      formatError: (err: any) => {
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
