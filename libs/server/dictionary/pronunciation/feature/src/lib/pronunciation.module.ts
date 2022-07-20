import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { PronunciationService } from '@els/server/dictionary/pronunciation/data-access/services';
import { PronunciationMutationsResolver } from './pronunciation-mutation.resolver';
import { PronunciationResolver } from './pronunciation.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([Pronunciation])],
  controllers: [],
  providers: [
    PronunciationService,
    PronunciationMutationsResolver,
    PronunciationResolver
  ],
  exports: [PronunciationService],
})
export class PronunciationModule {};
