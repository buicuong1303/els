import {
    Resolver,
    Query,
    Mutation,
    Args,
    ResolveField,
    Parent,
    ComplexityEstimatorArgs,
    Context,
  } from '@nestjs/graphql';
  
import * as DataLoader from 'dataloader';
import { ExampleTranslation } from '../../../data-access/entities/src';
import { ExampleTranslationService } from '../../../data-access/services/src';
import { ExampleTranslationMutations } from '../../../data-access/types/src';
  @Resolver(() => ExampleTranslation)
  export class ExampleTranslationResolver {
    constructor(
      private readonly _exampleTranslationService: ExampleTranslationService,
    ) {}

    @Mutation(() => ExampleTranslationMutations, {
      nullable: true,
      description: 'Root mutation for all courses related mutations',
    })
    exampleTranslationMutations() {
      return {};
    };

    @Query(() => [ExampleTranslation])
    getExampleTranslations() {
      return this._exampleTranslationService.getExampleTranslations();
    };
  };
  