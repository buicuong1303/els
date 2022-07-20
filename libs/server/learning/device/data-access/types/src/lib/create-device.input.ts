import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateDeviceInput {
  @Field()
  newToken!: string;
}
