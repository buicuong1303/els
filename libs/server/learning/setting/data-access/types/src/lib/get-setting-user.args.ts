import { Field, ArgsType } from '@nestjs/graphql';
@ArgsType()
export class GetSettingUserArgs{
  @Field(() => String)
  userId!: string;
}
