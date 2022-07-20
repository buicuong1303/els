/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { LessonModule } from '@els/server/learning/lesson/feature';
import { QuestionModule } from '@els/server/learning/question/feature';
import { ResourceQueueModule } from '@els/server/learning/queues';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import { TopicService } from '@els/server/learning/topic/data-access/services';
import { VocabularyModule } from '@els/server/learning/vocabulary/feature';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TopicMutationsResolver } from './topic-mutation.resolver';
import { TopicQueriesResolver } from './topic-queries.resolver';
import { TopicResolver } from './topic.resolver';
@Module({
  imports: [
    TypeOrmModule.forFeature([Topic]),
    LessonModule,
    VocabularyModule,
    QuestionModule,
    ResourceQueueModule,
  ],
  controllers: [],
  providers: [TopicResolver, TopicMutationsResolver, TopicQueriesResolver, TopicService],
  exports: [TopicService],
})
export class TopicModule {}
