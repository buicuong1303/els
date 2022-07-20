import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class InvitationAcceptInput{
  @Field()
  inviterId!: string;
}