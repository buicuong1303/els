/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { ExampleTranslation } from '../../../data-access/entities/src';
import { ExampleTranslationService } from '../../../data-access/services/src';
import { CreateExampleTranslationInput, ExampleTranslationMutations } from '../../../data-access/types/src';

@Resolver(() => ExampleTranslationMutations )
export class ExampleTranslationMutationsResolver {
  constructor(
    private readonly _exampleTranslationService: ExampleTranslationService
  ) {}


  @ResolveField(() => ExampleTranslation)
  create(
  @Args('createExampleTranslationInput') createExampleTranslationInput: CreateExampleTranslationInput
  ) {
    return this._exampleTranslationService.createExampleTranslation(createExampleTranslationInput);
  };

};
