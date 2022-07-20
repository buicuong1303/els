
import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateSessionInput {
  /**
   * identity = username, email or phone number
   */
  @Field({
    nullable: true,
    description: 'Identity field accepts a username or email of an account',
  })
  @IsNotEmpty()
  identity!: string;

  @Field()
  @IsNotEmpty()
  password!: string;
}
