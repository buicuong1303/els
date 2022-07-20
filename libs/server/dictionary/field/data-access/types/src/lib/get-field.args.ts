import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class GetFieldArgs {
  @Field()
  name!: string;
};
