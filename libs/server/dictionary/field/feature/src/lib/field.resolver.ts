import {
  Resolver,
  Query,
  Mutation,
  Args,
} from '@nestjs/graphql';
  
import { FieldTbMutations, GetFieldArgs } from '@els/server/dictionary/field/data-access/types';
import { FieldTbService } from '@els/server/dictionary/field/data-access/services';
import { FieldTb } from '@els/server/dictionary/field/data-access/entities';
@Resolver(() => FieldTb)
export class FieldTbResolver {
  constructor(
    private readonly _fieldTbService: FieldTbService,
    //   private readonly _meaningService: MeaningService,
    //   private readonly _langService: LangService,

  ) {}

  @Mutation(() => FieldTbMutations, {
    nullable: true,
    description: 'Root mutation for all courses related mutations',
    name: 'field',
  })
  fieldMutations() {
    return {};
  }

  @Query(() => FieldTb)
  field(@Args('getFieldArgs') getFieldArgs: GetFieldArgs) {
    return this._fieldTbService.getWordInField(getFieldArgs);
  }
}
  