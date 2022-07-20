import { ArgsType, Field} from '@nestjs/graphql';
@ArgsType()
export class GetCategoryDetailsArgs {
  @Field({nullable: true})
  userId?: string;

  @Field()
  categoryId!: string;
}