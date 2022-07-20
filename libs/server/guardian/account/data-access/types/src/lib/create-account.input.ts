import { InputType, Field } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

import { Match } from '@els/server/shared';

@InputType()
export class PhoneNumberInput {
  @Field({
    description:
      'Digit is the local version of a phone number e.g 111 222 3333',
  })
  @IsNumberString()
  digit!: string;

  @Field({
    description:
      'The prefix is the international dialing preference e.g +234 or +1',
  })
  @Matches(/^[+]\d{1,3}$/g, { message: 'Invalid international dialing prefix' })
  prefix!: string;
}

@InputType()
export class CreateAccountInput {
  @Field()
  firstName?: string;

  @Field({ nullable: true })
  middleName?: string;

  @Field()
  lastName?: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field({ nullable: true })
  username!: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  userInvitedId?: string;

  @Field({ nullable: true })
  picture?: string;

  @Field()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  password!: string;

  @Field()
  @IsNotEmpty()
  @Match('password')
  confirmPassword!: string;
}
