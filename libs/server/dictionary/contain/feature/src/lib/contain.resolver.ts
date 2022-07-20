import { Contain } from '@els/server/dictionary/contain/data-access/entities';
import { ContainService } from '@els/server/dictionary/contain/data-access/services';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import {
  Parent, ResolveField, Resolver
} from '@nestjs/graphql';
@Resolver(() => Contain)
export class ContainResolver {
  constructor(
    private readonly _containService: ContainService,
  ) {};

  @ResolveField(() => [Phrase], { name: 'phrase' })
  phrase(@Parent() contain: Contain) {
    const result = this._containService.findPhraseByContainId(contain.id);
    return result;
  };
};
  