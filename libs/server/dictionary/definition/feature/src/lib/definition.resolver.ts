import { GqlContext } from '@els/server/dictionary/common';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { DefinitionService } from '@els/server/dictionary/definition/data-access/services';
import { Detail } from '@els/server/dictionary/detail/data-access/entities';
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { FieldTb } from '@els/server/dictionary/field/data-access/entities';
import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { checkCache } from '@els/server/shared';
import {
  Args, Context, Parent, ResolveField, Resolver
} from '@nestjs/graphql';

@Resolver(() => Definition)
export class DefinitionResolver {
  constructor(
    private readonly _definitionService: DefinitionService,
  ) {};

  @ResolveField(() => [Word], { name: 'synonyms' })
  async synonyms(
  @Parent() definition: Definition,
    @Args('source') source: string,
    @Context() ctx: GqlContext
  ) {
    const data = await checkCache(ctx.cache, `data-caching:definitions_${definition.id}`,
      this._definitionService.findSynonymsById.bind(this._definitionService, definition.id, source), 60);
    return data;
  };

  @ResolveField(() => [Word], { name: 'translates' })
  async translates(
  @Parent() definition: Definition,
    @Args('target') target: string,
    @Context() ctx: GqlContext
  ) {
    const data = await checkCache(ctx.cache, `data-caching:translates_${definition.id}`,
      this._definitionService.findTranslateById.bind(this._definitionService, definition.id, target), 60);
    return data;
  };

  @ResolveField(() => Pronunciation, { name: 'pronunciation' })
  pronunciation(@Parent() definition: Definition) {
    return this._definitionService.findPronunciationById(definition.id);
  };

  @ResolveField(() => FieldTb, { name: 'fieldTb' })
  fieldTb(@Parent() definition: Definition) {
    return this._definitionService.findFieldTbById(definition.id);
  };

  @ResolveField(() => [Example], { name: 'examples' })
  examples(@Parent() definition: Definition) {
    return this._definitionService.findExamplesById(definition.id);
  };

  @ResolveField(() => [Detail], { name: 'detail' })
  detail(@Parent() definition: Definition) {
    return this._definitionService.findDetailById(definition.id);
  };
};
