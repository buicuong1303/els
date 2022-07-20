import { Mutation, Resolver, Args, Query, ResolveField, Parent, ComplexityEstimatorArgs, Context } from '@nestjs/graphql';
import { Vocabulary, ReferenceUnion } from '@els/server/learning/vocabulary/data-access/entities';
import {
  VocabularyMutations,
  GetVocabulariesInput
} from '@els/server/learning/vocabulary/data-access/types';
import { VocabularyService } from '@els/server/learning/vocabulary/data-access/services';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import DataLoader = require('dataloader');
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { GqlContext } from '@els/server/learning/common';

@Resolver(() => Vocabulary)
export class VocabularyResolver {
  constructor(private readonly _vocabularyService: VocabularyService){}
  @Mutation(() => VocabularyMutations, { name: 'vocabulary', nullable: true })
  vocabularyMutations() {
    return {};
  }

  @Query(() => [Vocabulary])
  vocabularies(@Args('getVocabulariesInput') getVocabulariesInput:GetVocabulariesInput ) {
    return this._vocabularyService.getVocabulariesByIds(getVocabulariesInput.vocabularyIds);
  }

  @ResolveField(() => Lesson, {
    nullable: true,
    name: 'lesson',
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async lesson(
  @Parent() vocabulary: Vocabulary,
    @Context('lessonsLoader') lessonsLoader: DataLoader<string, Lesson>
  ) {
    return lessonsLoader.load(vocabulary.lessonId);
  }

  @ResolveField(() => Topic, {
    nullable: true,
    name: 'topic',
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    },
  })
  async topic(
  @Parent() vocabulary: Vocabulary,
    @Context('topicsLoader') topicsLoader: DataLoader<string, Topic>
  ) {
    return topicsLoader.load(vocabulary.topicId);
  }

  @ResolveField(() => ReferenceUnion, { nullable: true })
  reference(@Parent() vocabulary: Vocabulary, @Context() ctx: GqlContext) {
    if (!vocabulary.referenceId) return null;
    return { __typename: 'reference', id: vocabulary.referenceId, type: vocabulary.type, cache: ctx.cache };
  }

  @ResolveField(() => String)
  audio(@Parent() vocabulary: Vocabulary) {
    return this._vocabularyService.getAudioResource(vocabulary.id);
  }

  @ResolveField(() => String)
  image(@Parent() vocabulary: Vocabulary) {
    return this._vocabularyService.getImageResource(vocabulary.id);
  }
}
