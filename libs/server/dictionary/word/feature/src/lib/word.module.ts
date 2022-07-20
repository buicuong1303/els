/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { WordImportService, WordService } from '@els/server/dictionary/word/data-access/services';
import { WordResolver } from './word.resolver';
import { WordMutationsResolver } from './word-mudation.resolver';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Concept } from '@els/server/dictionary/concept/data-access/entities';
import { Join } from '@els/server/dictionary/join/data-access/entities';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { Contain } from '@els/server/dictionary/contain/data-access/entities';
import { Pos } from '@els/server/dictionary/pos/data-access/entities';
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { Term } from '@els/server/dictionary/term/data-access/entities';
import { ExampleModule } from '@els/server/dictionary/example/feature';
import { Detail } from '@els/server/dictionary/detail/data-access/entities';
import { RedisCacheModule } from '@els/server/shared';

@Module({
  imports: [TypeOrmModule.forFeature([
    Word,
    Meaning,
    Pronunciation,
    Definition,
    Concept,
    Join,
    Phrase,
    Contain,
    Pos,
    Example,
    Term,
    Detail,
  ]),
  ExampleModule,
  HttpModule.register({
    headers: {
      'x-rapidapi-host': process.env.WORD_API_HOST,
      'x-rapidapi-key' : process.env.WORD_API_KEY
    },
    baseURL: process.env.WORD_API_ENDPOINT
  }),
  RedisCacheModule
  ],
  controllers: [],
  providers: [
    WordService,
    WordImportService,
    WordResolver,
    WordMutationsResolver
  ],
  exports: [WordService],
})
export class WordModule {}
