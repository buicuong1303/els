/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { GqlContext } from '@els/server/learning/common';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import { LessonService } from '@els/server/learning/lesson/data-access/services';
import { Specialization } from '@els/server/learning/specialization/data-access/entities';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { TopicService } from '@els/server/learning/topic/data-access/services';
import {
  GetMyTopicDetailsArgs, GetTopicsArgs, PaginatedTopic, TopicMutations,
  TopicQueries
} from '@els/server/learning/topic/data-access/types';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { VocabularyService } from '@els/server/learning/vocabulary/data-access/services';
import { Auth, AuthGuard, BaseLang, checkCache, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import {
  Args, ComplexityEstimatorArgs, Context, Mutation, Parent, Query, ResolveField, Resolver
} from '@nestjs/graphql';
import DataLoader = require('dataloader');

@Resolver(() => Topic)
export class TopicResolver {
  constructor(
    private readonly _topicService: TopicService,
    private readonly _lessonService: LessonService,
    private readonly _vocabularyService: VocabularyService,
  ) {}
  @Mutation(() => TopicMutations, {
    nullable: true,
    description: 'Root mutation for all courses related mutations',
    name: 'topic',
  })
  @UseGuards(AuthGuard)
  topicMutations() {
    return {};
  }

  @Query(() => TopicQueries, {
    nullable: true,
    description: 'Root mutation for all courses related mutations',
    name: 'topic',
  })
  @UseGuards(AuthGuard)
  topicQueries() {
    return {};
  }
  // @Mutation(() => String)
  // async importTopic(
  //   @Args({ name: 'file', type: () => GraphQLUpload })
  //   file: FileUpload
  // ) {
  //   console.log('Import file');
  // }

  @Query(() => PaginatedTopic, { nullable: true })
  topics(@Args() getTopicsArgs: GetTopicsArgs, @Context() ctx: GqlContext): Promise<PaginatedTopic> {
    return this._topicService.getTopics(getTopicsArgs, ctx.cache);
  }

  @Query(() => [Topic], { nullable: true })
  @UseGuards(AuthGuard)
  async myTopics(@Auth() identity: Identity) {
    return this._topicService.getMyTopics(identity);
  }

  @Query(() => [Topic], { nullable: true })
  @UseGuards(AuthGuard)
  myTopicDetails(@Args() getMyTopicDetailsArgs: GetMyTopicDetailsArgs) {
    return this._topicService.getMyTopicDetails(getMyTopicDetailsArgs);
  }

  @ResolveField(() => [Lesson], { name: 'lessons' })
  lessons(@Parent() topic: Topic, @Context() ctx) {
    return checkCache(ctx.cache, `data-caching:lessons:topic_${topic.id}`,  this._lessonService.findByTopicId.bind(this._lessonService, topic.id), 30 * 24 * 60 * 60);
  }

  @ResolveField(() => [Vocabulary], { name: 'vocabularies' })
  vocabularies(@Parent() topic: Topic, @Context() ctx) {
    return checkCache(ctx.cache, `data-caching:vocabularies:topic_${topic.id}`,  this._vocabularyService.findByTopicId.bind(this._vocabularyService, topic.id), 30 * 24 * 60 * 60);
  }

  @ResolveField(() => Specialization, {
    nullable: true,
    name: 'specialization',
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async specialization(
  @Parent() topic: Topic,
    @Context('specializationsLoader')
    specializationsLoader: DataLoader<string, Specialization>
  ) {
    if (topic.specializationId) {
      return specializationsLoader.load(topic.specializationId);
    }
  }



  @ResolveField(() => BaseLang, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async fromLang(
  @Parent() topic: Topic,
    @Context('languagesLoader') languagesLoader: DataLoader<string, BaseLang>,
  ) {
    return languagesLoader.load(topic.fromLangId);
  }

  @ResolveField(() => BaseLang, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async learningLang(
  @Parent() topic: Topic,
    @Context('languagesLoader') languagesLoader: DataLoader<string, BaseLang>
  ) {
    return languagesLoader.load(topic.learningLangId);
  }

  @ResolveField(() => String)
  numberOfParticipants( @Parent() topic: Topic) {
    return this._topicService.countParticipants(topic.id);
  }
}
