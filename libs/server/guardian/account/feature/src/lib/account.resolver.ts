import { AccountService } from '@els/server-guardian-account-data-access-services';
import {
  AccountIdentityMutations, AccountIdentityQueries
} from '@els/server-guardian-account-data-access-types';
import { AccountIdentity } from '@els/server/guardian/common';
import { Args, Mutation, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import 'reflect-metadata';
@Resolver(() => AccountIdentity)
export class AccountIdentityResolver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(private readonly _accountService: AccountService) {
  }

  @Mutation(() => AccountIdentityMutations, {
    nullable: true,
    description: 'Root mutation for all accounts related mutations',
    name: 'account',
  })
  async accountIdentityMutations() {
    return {};
  }

  @Query(() => AccountIdentityQueries, {
    nullable: true,
    description: 'Root query for all accounts related queries',
    name: 'account',
  })
  accountIdentityQueries() {
    return {};
  }

  @Query(() => AccountIdentity, { nullable: true } )
  accountIdentity(@Args('id') id: string){
    return this._accountService.getInfo(id);
  }

  @ResolveReference()
  resolveReference(ref: { __typename: string; id: string }) {
    return this._accountService.getInfo(ref.id);
  }

}
