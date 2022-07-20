import { Prompt, Question } from '@els/server/learning/question/data-access/entities';
import { QuestionService } from '@els/server/learning/question/data-access/services';
import { GetQuestionArgs, QuestionMutations, QuickTestArgs } from '@els/server/learning/question/data-access/types';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
import { Auth, AuthGuard, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import { Args, ComplexityEstimatorArgs, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader = require('dataloader');

@Resolver(() => Question)

export class QuestionResolver {
  constructor(private readonly _questionService: QuestionService){}
  @Mutation(() => QuestionMutations, { nullable: true, name: 'question' })
  createQuestions() {
    return {};
  }

  @Query(() => [Question])
  @UseGuards(AuthGuard)
  questions(@Args() getQuestionsArgs: GetQuestionArgs, @Auth() identity: Identity) {
    return this._questionService.getQuestions(getQuestionsArgs, identity.account.id);
  }

  @Query(() => [Question])
  @UseGuards(AuthGuard)
  quickTest(@Args() quickTestArgs: QuickTestArgs, @Auth() identity: Identity) {
    return this._questionService.quickTest(quickTestArgs, identity.account.id);
  }  

  @ResolveField(() => [Prompt], { name: 'prompt' })
  prompt(@Parent() question: Question ) {
    return this._questionService.findByPromptId(question.promptId);
  }
  
  @ResolveField(() => Question, {
    nullable: true,
    complexity: (options: ComplexityEstimatorArgs) => {
      return options.args.count * options.childComplexity;
    }})
  async vocabulary(
  @Parent() question: Question,
    @Context('vocabulariesLoader') vocabulariesLoader: DataLoader<string, Vocabulary>
  ) {
    return vocabulariesLoader.load(question.vocabularyId);
  }
}
