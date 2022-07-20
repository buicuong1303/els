import { Pos } from '@els/server/dictionary/pos/data-access/entities';
import { PosService } from '@els/server/dictionary/pos/data-access/services';
import {
  Query, Resolver
} from '@nestjs/graphql';
@Resolver(() => Pos)
export class PosResolver {
  constructor(
    private readonly _posService: PosService,
  ) {};
  @Query(() => [Pos], { name: 'pos' })
  async getWord() {
    return await this._posService.findPos();
  };
};
  