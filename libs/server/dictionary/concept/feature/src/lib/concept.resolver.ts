import { Concept } from '@els/server/dictionary/concept/data-access/entities';
import { ConceptService } from '@els/server/dictionary/concept/data-access/services';
import { ConceptMutations } from '@els/server/dictionary/concept/data-access/types';
import {
  Mutation, Resolver
} from '@nestjs/graphql';

@Resolver(() => Concept)
export class ConceptResolver {
  constructor(private readonly _conceptService: ConceptService) {};

  @Mutation(() => ConceptMutations, {
    nullable: true,
    description: 'Root mutation for all courses related mutations',
    name: 'concept',
  })
  conceptsMutations() {
    return {};
  };
}
