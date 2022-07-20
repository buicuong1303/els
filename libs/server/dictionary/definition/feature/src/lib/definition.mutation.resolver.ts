import { DefinitionService } from '@els/server/dictionary/definition/data-access/services';
import { DefinitionMutations } from '@els/server/dictionary/definition/data-access/types';
import { Resolver } from '@nestjs/graphql';

@Resolver(() => DefinitionMutations )
export class DefinitionMutationsResolver {
  constructor(
    private readonly _wordService: DefinitionService
  ) {};
};
