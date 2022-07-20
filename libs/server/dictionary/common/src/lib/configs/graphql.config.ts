import { GqlContext as SharedGqlContext, GuardianGrpcServiceClient, IFastifyReply, IFastifyRequest, LearningGrpcServiceClient } from '@els/server/shared';
import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import {
  ApolloServerPluginInlineTraceDisabled, ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core';
import { GraphQLSchema } from 'graphql';
import { applyMiddleware } from 'graphql-middleware';
import { join } from 'path';
import { redisOptions } from '.';
import { corsApolloOptions } from './cors.config';
import * as Redis from 'ioredis';

export interface GqlContext extends SharedGqlContext{
  connection?: any;

  //* express
  // req?: Partial<IRequest>;
  // res?: Partial<ExpressResponse>

  //* fastify
  req: IFastifyRequest;
  res: IFastifyReply;
  payload: any;
  rpc: {
    guardian:GuardianGrpcServiceClient,
    learning:LearningGrpcServiceClient
  },
  // queue : {
  //   // missionQueue: MissionQueueService
  // }

  //* loader
  // topicsLoader: any,
  // vocabulariesLoader: any,
  // specializationsLoader: any,
  // languagesLoader: any,
  // lessonsLoader: any,
  // skillsLoader: any,
  // missionsLoader: any,
  // missionTargetsLoader: any,
  // enrollmentsLoader: any,
  // categoriesLoader: any,
  // rewardsLoader: any,
  // rewardUnitsLoader: any,
}

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private readonly _guardianGSC: GuardianGrpcServiceClient,
    private readonly _learningGSC: LearningGrpcServiceClient
  ) {}

  createGqlOptions(): GqlModuleOptions {
    // const cache = new RedisCache(redisOptions);
    // cache.defaultSetOptions.ttl = 20;

    const cache = new BaseRedisCache({
      client: new Redis(redisOptions)
    });

    return {
      debug: true,
      // playground: false,
      autoSchemaFile: join(process.cwd(), 'gql-schema/dictionary.gql'), //* guardian will using src/guardian-schema.gql
      sortSchema: true,

      transformSchema: (schema: GraphQLSchema) => { //* run after middleware
        schema = applyMiddleware(schema);
        return schema;
      },

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

      context: ({ req, res, payload, connection, request, reply }) => {
        const ctx: GqlContext = {
          cache,
          req: request ?? req,
          res: reply ?? res,
          payload,
          connection,
          rpc: {
            guardian: this._guardianGSC,
            learning: this._learningGSC,
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
