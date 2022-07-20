/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhraseService } from '@els/server/dictionary/phrase/data-access/services';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { PhraseMutationsResolver } from './phrase-mutation.resolver';
import { PhraseResolver } from './phrase.resolver';
import { PhraseTranslation } from '@els/server/dictionary/phrase-translation/data-access/entities';
import { PhraseTranslationModule } from '@els/server/dictionary/phrase-translation/feature';
@Module({
  imports: [TypeOrmModule.forFeature([
    Phrase, PhraseTranslation
  ]),
  PhraseTranslationModule
  ],
  controllers: [],
  providers: [
    PhraseService,
    PhraseResolver,
    PhraseMutationsResolver
  ],
  exports: [PhraseService],
})
export class PhraseModule {};
