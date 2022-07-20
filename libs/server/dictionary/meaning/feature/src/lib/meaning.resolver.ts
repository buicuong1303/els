import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { MeaningService } from '@els/server/dictionary/meaning/data-access/services';
import { Pos } from '@els/server/dictionary/pos/data-access/entities';
import {
  Parent, ResolveField, Resolver
} from '@nestjs/graphql';

@Resolver(() => Meaning)
export class MeaningResolver {
  constructor(
    private readonly _meaningService: MeaningService,
  ) {};

  @ResolveField(() => Pos, {name: 'pos'})
  pos(@Parent() meaning: Meaning) {
    return this._meaningService.findPosById(meaning.id);
  };

  @ResolveField(() => [Definition], {name: 'definitions'})
  definitions(@Parent() meaning: Meaning) {
    // console.log('Get definitions: ' + new Date().getSeconds());
    return this._meaningService.findDefinitionsById(meaning.id);
  };
};
