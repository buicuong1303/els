import { Field, InputType, OmitType, PartialType, PickType } from '@nestjs/graphql';
import { CreateAccountInput } from './create-account.input';
@InputType()
export class UpdateProfileInput extends PartialType(OmitType (CreateAccountInput, ['password', 'confirmPassword'])) {}

@InputType()
export class UpdatePasswordInput extends PickType (CreateAccountInput, ['password', 'confirmPassword']) {
  @Field()
  currentPassword!: string;
}

@InputType()
export class CheckCurrentPasswordInput {
  @Field()
  currentPassword!: string;
}
