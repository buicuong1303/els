import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class UpdateDeviceInput {
  @Field()
  token!: string;
}
