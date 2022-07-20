import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { QuestionMutations } from '@els/server/learning/question/data-access/types';
import { QuestionService } from '@els/server/learning/question/data-access/services';
@Resolver(() => QuestionMutations)
export class QuestionMutationsResolver {
  constructor(private readonly _questionService: QuestionService) {}
  @ResolveField(() => String)
  generateQuestions(@Args('topicId') topicId: string) {
    return this._questionService.generateQuestionsByTopicId(topicId);
  }
}
