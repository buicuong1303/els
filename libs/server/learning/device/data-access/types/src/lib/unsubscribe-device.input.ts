import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class DeleteDeviceInput {
  @Field()
  token!: string;
}
