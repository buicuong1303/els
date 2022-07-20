/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { ExampleService } from '@els/server/dictionary/example/data-access/services';
import { ExampleResolver } from './example.resolver';
import { ExampleMutationsResolver } from './example-mutation.resolver';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Term } from '@els/server/dictionary/term/data-access/entities';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { ExampleTranslation } from 'libs/server/dictionary/example-translation/data-access/entities/src';
import { Lang } from '@els/server/dictionary/lang/data-access/entities';
@Module({
  imports: [TypeOrmModule.forFeature([
    Example,
    Definition,
    Term,
    Word,
    Phrase,
    ExampleTranslation,
    Lang
  ]),
  HttpModule.register({
    headers: {
      'x-rapidapi-host': process.env.TRANSLATION_API_HOST,
      'x-rapidapi-key' : process.env.TRANSLATION_API_KEY
    },
    baseURL: process.env.WORD_API_ENDPOINT
  })
  ],
  controllers: [],
  providers: [
    ExampleService, 
    ExampleResolver, 
    ExampleMutationsResolver
  ],
  exports: [ExampleService],
})
export class ExampleModule {};
