import { Resolver, ResolveField, Args } from '@nestjs/graphql';
import {
  ConceptMutations,
  CreateConceptInput,
} from '@els/server/dictionary/concept/data-access/types';
import { ConceptService } from '@els/server/dictionary/concept/data-access/services';
import { Concept } from '@els/server/dictionary/concept/data-access/entities';

@Resolver(() => ConceptMutations)
export class ConceptMutationsResolver {
  constructor(private readonly _conceptService: ConceptService) {}

  @ResolveField(() => Concept)
  create(@Args('createConceptInput') createConceptInput: CreateConceptInput) {
    return this._conceptService.createConcept(createConceptInput);
  };

}
