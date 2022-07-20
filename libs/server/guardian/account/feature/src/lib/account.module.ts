/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { AccountIdentityResolver } from './account.resolver';
import { AccountController } from './account.controller';
import { AccountIdentityMutationsResolver } from './account-mutations.resolver';
import { AccountIdentityQueriesResolver } from './account-queries.resolver';
import { AccountService } from '@els/server-guardian-account-data-access-services';
import { KratosModule } from '@els/server/guardian/common';
import { RedisCacheModule } from '@els/server/shared';

@Module({
  imports: [KratosModule, RedisCacheModule],
  providers: [
    AccountIdentityResolver,
    AccountIdentityMutationsResolver,
    AccountIdentityQueriesResolver,
    AccountService,
  ],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
