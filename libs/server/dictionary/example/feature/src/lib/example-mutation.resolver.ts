/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import { Example } from '../../../data-access/entities/src';
import { ExampleService } from '../../../data-access/services/src';
import { ExampleMutations, CreateExampleInput, TranslateExampleInput } from '../../../data-access/types/src';

@Resolver(() => ExampleMutations )
export class ExampleMutationsResolver {
  constructor(
    private readonly _exampleService: ExampleService
  ) {};

  @ResolveField(() => Example)
  create(
  @Args('createExampleInput') createExampleInput: CreateExampleInput
  ) {
    return this._exampleService.createExample(createExampleInput);
  };

  @ResolveField(() => Example)
  async translateExamplesApi( @Args('translateExampleInput') translateExampleInput: TranslateExampleInput) {
    const result = await this._exampleService.translateExamples(translateExampleInput);
    return result;
  };
};
