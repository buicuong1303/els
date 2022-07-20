import { TopicService } from '@els/server/learning/topic/data-access/services';
import { GetActualSkillHistoryArgs, TopicQueries } from '@els/server/learning/topic/data-access/types';
import { JSONType } from '@els/server/shared';
import { Args, ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => TopicQueries)
export class TopicQueriesResolver {
  constructor(private readonly _topicService: TopicService) {}

  @ResolveField(() => JSONType)
  getActualSkillHistory(@Args() getActualSkillHistoryArgs: GetActualSkillHistoryArgs) {
    return this._topicService.getActualSkillHistories(getActualSkillHistoryArgs);
  }

}
