/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Directive,
  Field,
  ID,
  InputType,
  ObjectType,
} from '@nestjs/graphql';
import { Identity, SessionAuthenticationMethod } from '@ory/kratos-client';

@ObjectType()
export class AccountIdentityRecoveryAddress {
  @Field()
  id!: string;

  @Field()
  value!: string;

  @Field()
  via?: string;
}

@ObjectType()
export class AccountIdentityVerifiableAddress extends AccountIdentityRecoveryAddress {
  @Field()
  status!: string;

  @Field()
  verified!: boolean;
}

@InputType()
@ObjectType()
export class IdentityNameTraits {
  @Field()
  first!: string;
}

@ObjectType()
export class AccountIdentityTraits {
  @Field({ nullable: true })
  email?: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field({nullable: true})
  middleName?: string;

  @Field({nullable: true})
  picture?: string;

  @Field({ nullable: true })
  inviter?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  username?: string;
}

@ObjectType()
@Directive('@key(fields: "id")')
export class AccountIdentity {
  @Field(() => ID)
  id!: string;

  @Field()
  state?: string;

  @Field()
  traits!: AccountIdentityTraits;

  @Field(() => [AccountIdentityVerifiableAddress], { nullable: true })
  verifiableAddresses?: AccountIdentityVerifiableAddress[];

  @Field(() => [AccountIdentityRecoveryAddress])
  recoveryAddresses!: AccountIdentityRecoveryAddress[];

  @Field(() => [String])
  authenticationMethods?: string[];

  constructor(identity?: Identity, authenticationMethods?: SessionAuthenticationMethod[]) {
    if (identity) {
      this.id = identity.id;
      this.state = identity.state;
      this.traits = identity.traits;
      this.verifiableAddresses = <AccountIdentityVerifiableAddress[]>(
        identity.verifiable_addresses
      );
      this.recoveryAddresses = <AccountIdentityRecoveryAddress[]>(
        identity.recovery_addresses
      );

      this.authenticationMethods = authenticationMethods?.map(method => method.method?.toString() ?? '') ?? [];
    };
  };
};
