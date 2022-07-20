import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class EmailInviterPayload {
  @Field()
  email!: string;

  @Field()
  userId!: string;

  @Field()
  subject!: string;

  @Field()
  username!: string;
}
