import { Example } from '@els/server/dictionary/example/data-access/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleTranslation } from '../../../data-access/entities/src';
import { ExampleTranslationService } from '../../../data-access/services/src';
import { ExampleTranslationMutationsResolver } from './example-translation-mutation.resolver';
import { ExampleTranslationResolver } from './example-translation.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([
    ExampleTranslation,
    Example
  ])],
  controllers: [],
  providers: [
    ExampleTranslationService,
    ExampleTranslationMutationsResolver,
    ExampleTranslationResolver
  ],
  exports: [ExampleTranslationService],
})
export class ExampleTranslationModule {};
