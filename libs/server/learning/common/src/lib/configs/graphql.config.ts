/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CategoryService } from '@els/server/learning/category/data-access/services';
import { CommentService } from '@els/server/learning/comment/data-access/services';
import { EnrollmentService } from '@els/server/learning/enrollment/data-access/services';
import { LanguageService } from '@els/server/learning/language/data-access/services';
import { LessonService } from '@els/server/learning/lesson/data-access/services';
import { MissionService } from '@els/server/learning/mission/data-access/services';
import { MissionQueueService } from '@els/server/learning/queues';
import { RewardUnitService } from '@els/server/learning/reward-unit/data-access/services';
import { TopicService } from '@els/server/learning/topic/data-access/services';
import { UserService } from '@els/server/learning/user/data-access/services';
import { VocabularyService } from '@els/server/learning/vocabulary/data-access/services';
import {
  DictionaryGrpcServiceClient,
  GqlContext as SharedGqlContext,
  GuardianGrpcServiceClient,
  Identity,
  IFastifyReply,
  IFastifyRequest
} from '@els/server/shared';
import { Injectable } from '@nestjs/common';
import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import {
  ApolloServerPluginInlineTraceDisabled, ApolloServerPluginLandingPageLocalDefault
} from 'apollo-server-core';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import type {
  GraphQLRequestContext
} from 'apollo-server-types';
import { DirectiveLocation, GraphQLBoolean, GraphQLDirective, GraphQLInt, GraphQLString } from 'graphql';
import * as Redis from 'ioredis';
import { SkillService } from 'libs/server/learning/skill/data-access/services/src';
import { SpecializationService } from 'libs/server/learning/specialization/data-access/services/src';
import { join } from 'path';
import { upperDirectiveTransformer } from '../graphql';
import { createCategoriesLoader } from '../graphql/loaders/category.loader';
import { createEnrollmentsLoader } from '../graphql/loaders/enrollment.loader';
import { createEntitiesLoader } from '../graphql/loaders/entities.loader';
import { createLanguagesLoader } from '../graphql/loaders/language.loader';
import { createLessonsLoader } from '../graphql/loaders/lesson.loader';
import { createMissionTargetsLoader } from '../graphql/loaders/mission-target.loader';
import { createMissionsLoader } from '../graphql/loaders/mission.loader';
import { createRewardUnitsLoader } from '../graphql/loaders/reward-unit.loader';
import { createRewardsLoader } from '../graphql/loaders/reward.loader';
import { createSkillsLoader } from '../graphql/loaders/skill.loader';
import { createSpecializationsLoader } from '../graphql/loaders/specialization.loader';
import { createTopicsLoader } from '../graphql/loaders/topic.loader';
import { createUsersLoader } from '../graphql/loaders/user.loader';
import { createVocabulariesLoader } from '../graphql/loaders/vocabulary.loader';
import { corsApolloOptions } from './cors.config';
import { redisOptions } from './redis.config';
export interface GqlContext extends SharedGqlContext {
  connection?: any;
  cache: BaseRedisCache,
  //* express
  // req?: Partial<IRequest>;
  // res?: Partial<ExpressResponse>

  //* fastify
  req: IFastifyRequest;
  res: IFastifyReply;
  payload: any;
  rpc: {
    guardian: GuardianGrpcServiceClient;
    dictionary: DictionaryGrpcServiceClient;
  };
  queue: {
    missionQueue: MissionQueueService;
  };

  //* loader
  topicsLoader: any;
  vocabulariesLoader: any;
  specializationsLoader: any;
  languagesLoader: any;
  lessonsLoader: any;
  skillsLoader: any;
  missionsLoader: any;
  missionTargetsLoader: any;
  enrollmentsLoader: any;
  categoriesLoader: any;
  rewardsLoader: any;
  rewardUnitsLoader: any;
  entitiesLoader: any;
  usersLoader: any;
}

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private readonly _topicService: TopicService,
    private readonly _vocabularyService: VocabularyService,
    private readonly _specializationService: SpecializationService,
    private readonly _languagesService: LanguageService,
    private readonly _lessonService: LessonService,
    private readonly _skillService: SkillService,
    private readonly _missionService: MissionService,
    private readonly _userService: UserService,
    private readonly _enrollmentService: EnrollmentService,
    private readonly _categoryService: CategoryService,
    private readonly _rewardUnitService: RewardUnitService,
    private readonly _commentService: CommentService,
    private readonly _guardianGSC: GuardianGrpcServiceClient,
    private readonly _dictionaryGSC: DictionaryGrpcServiceClient,
    private readonly _missionQueueService: MissionQueueService
  ) {}
  createGqlOptions(): GqlModuleOptions {
    const cache = new BaseRedisCache({
      client: new Redis(redisOptions)
    });

    // const cache = new RedisCache(redisOptions);
    // cache.defaultSetOptions.ttl = 20;
    return {
      debug: true,
      // playground: false,
      autoSchemaFile: join(process.cwd(), 'gql-schema/learning.gql'), //* guardian will using src/guardian-schema.gql
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'cacheControl',
            locations: [
              DirectiveLocation.FIELD_DEFINITION,
              DirectiveLocation.OBJECT,
              DirectiveLocation.INTERFACE,
              DirectiveLocation.UNION,
            ],
            args: {
              maxAge: { type: GraphQLInt },
              scope: { type: GraphQLString },
              inheritMaxAge: { type: GraphQLBoolean },
            },
          }),
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      transformSchema: (schema) => upperDirectiveTransformer(schema, 'upper'),

      sortSchema: true,
      // transformSchema: (schema: GraphQLSchema) => {
      //   //* run after middleware
      //   schema = applyMiddleware(schema, permissions);
      //   return schema;
      // },

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

        //* Just working for InMemoryCaching, not compatible with redis
        responseCachePlugin({
          sessionId: (requestContext: GraphQLRequestContext) => {
            return requestContext?.request?.http?.headers.get('set-cookie') || requestContext?.request?.http?.headers.get('Authorization')||  null;
          },
        })
      ],
      persistedQueries: {
        cache,
      },
      // schemaDirectives: {},
      fieldResolverEnhancers: ['guards', 'interceptors'], //['interceptors', 'filters']

      //TODO: need check GqlContext
      context: ({ payload, connection, request, reply }) => {
        const identity = new Identity(request, reply);
        const ctx: GqlContext = {
          cache,
          req: {
            ...request,
            identity,
          },
          res: reply,
          payload,
          connection,
          topicsLoader: createTopicsLoader(this._topicService),
          vocabulariesLoader: createVocabulariesLoader(this._vocabularyService),
          specializationsLoader: createSpecializationsLoader(
            this._specializationService
          ),
          languagesLoader: createLanguagesLoader(this._languagesService),
          lessonsLoader: createLessonsLoader(this._lessonService),
          skillsLoader: createSkillsLoader(this._skillService),
          missionsLoader: createMissionsLoader(this._missionService),
          missionTargetsLoader: createMissionTargetsLoader(this._userService),
          enrollmentsLoader: createEnrollmentsLoader(this._enrollmentService),
          categoriesLoader: createCategoriesLoader(this._categoryService),
          rewardsLoader: createRewardsLoader(this._missionService),
          rewardUnitsLoader: createRewardUnitsLoader(this._rewardUnitService),
          entitiesLoader: createEntitiesLoader(this._commentService),
          usersLoader: createUsersLoader(this._userService),
          rpc: {
            guardian: this._guardianGSC,
            dictionary: this._dictionaryGSC,
          },
          queue: {
            missionQueue: this._missionQueueService,
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
