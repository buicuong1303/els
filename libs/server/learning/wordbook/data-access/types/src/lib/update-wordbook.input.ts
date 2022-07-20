import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class UpdateWordBookInput {
  @Field()
  name!: string;

  @Field()
  wordbookId!: string;

}
