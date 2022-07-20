import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetLessonArgs {
  @Field()
  id!: string;

}
