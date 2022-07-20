import { Topic } from '@els/server/learning/topic/data-access/entities';
import { TopicService } from '@els/server/learning/topic/data-access/services';
import {
  CreateTopicInput,
  DeleteTopicsInput,
  TopicMutations,
  SyncThumbnailTopicInput,
} from '@els/server/learning/topic/data-access/types';
import { Auth, AuthGuard, DeleteMany, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphQLUpload } from 'graphql-upload';

@Resolver(() => TopicMutations)
export class TopicMutationsResolver {
  constructor(private readonly _topicService: TopicService) {}

  @ResolveField(() => Topic)
  create(@Args('createTopicInput') createTopicInput: CreateTopicInput) {
    return this._topicService.createTopic(createTopicInput);
  }

  @ResolveField(() => String, { nullable: true })
  // @UseGuards(AuthGuard)
  uploadMissedAudio() {
    return this._topicService.uploadMissedAudio();
  }

  @ResolveField(() => DeleteMany)
  deleteMany(@Args('deleteTopicsInput') deleteTopicsInput: DeleteTopicsInput) {
    return this._topicService.deleteTopicsByIds(deleteTopicsInput.ids);
  }

  @ResolveField(() => DeleteMany)
  restoreMany(
  @Args('restoreTopicsInput') restoreTopicsInput: DeleteTopicsInput
  ) {
    return this._topicService.restoreTopicsByIds(restoreTopicsInput.ids);
  }

  @ResolveField(() => String, { nullable: true })
  async importTopic(
  @Args({ name: 'file', type: () => GraphQLUpload })
    file: any
  ) {
    return this._topicService.importTopic(file.file.buffer.data);
  }

  @ResolveField(() => Topic, { nullable: true })
  @UseGuards(AuthGuard)
  checkVocabularyMemorized(@Auth() identity: Identity) {
    return this._topicService.checkVocabularyMemorized(identity);
  }

  @ResolveField(() => Topic, { nullable: true })
  syncThumbnailTopic(
  @Args('syncThumbnailTopicInput')
    syncThumbnailTopicInput: SyncThumbnailTopicInput
  ) {
    return this._topicService.syncThumbnailTopic(syncThumbnailTopicInput);
  }
}
