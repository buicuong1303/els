import { Vocabulary, Resource } from '@els/server/learning/vocabulary/data-access/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VocabularyMutationResolver } from './vocabulary-mutation.resolver';
import { VocabularyResolver } from './vocabulary.resolver';
import { VocabularyService } from '@els/server/learning/vocabulary/data-access/services';
import { ResourceQueueModule } from '@els/server/learning/queues';

@Module({
  imports: [TypeOrmModule.forFeature([Vocabulary, Resource]), ResourceQueueModule ],
  controllers: [],
  providers: [
    VocabularyMutationResolver,
    VocabularyResolver,
    VocabularyService,
  ],
  exports: [VocabularyService],
})
export class VocabularyModule {}
