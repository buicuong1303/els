/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { Term } from '@els/server/dictionary/term/data-access/entities';
import {
  Mutation, Parent, ResolveField, Resolver
} from '@nestjs/graphql';
import { ExampleTranslation } from 'libs/server/dictionary/example-translation/data-access/entities/src';
import { ExampleService } from '../../../data-access/services/src';
import { ExampleMutations } from '../../../data-access/types/src';

@Resolver(() => Example)
export class ExampleResolver {
  constructor(
    private readonly _exampleService: ExampleService,
  ) {};

  @Mutation(() => ExampleMutations, {
    nullable: true,
    description: 'Root mutation for all courses related mutations',
    name: 'example',
  })
  exampleMutations() {
    return {};
  };

  @ResolveField(() => Phrase, {name: 'phrase'})
  phrase(@Parent() example: Example) {
    return this._exampleService.findPhraseById(example.id);
  };

  @ResolveField(() => [Term], {name: 'terms'})
  terms(@Parent() example: Example) {
    return this._exampleService.findTermById(example.id);
  };

  @ResolveField(() => [ExampleTranslation], {name: 'exampleTranslations'})
  exampleTranslations(@Parent() example: Example) {
    return this._exampleService.findExampleTranslationsById(example.id);
  };

};
