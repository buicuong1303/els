import { Field, ArgsType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class AccountAvailableArgs {
  /**
   * @description A unique field suc identity of an account
   */
  @Field({
    description: 'email, username or phoneNumber identity of an account',
  })
  @IsNotEmpty()
  identity!: string;
}
