import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { AccountIdentityMutations, CreateAccountInput, UpdateProfileInput, UpdatePasswordInput, CheckCurrentPasswordInput } from '@els/server-guardian-account-data-access-types';
import { AccountService } from '@els/server-guardian-account-data-access-services';
import { Auth, Identity, AuthGuard, exceptions } from '@els/server/shared';
import { Logger } from '@nestjs/common';
import { Session } from '@els/server-guardian-session-data-access-types';
import { AccountIdentity } from '@els/server/guardian/common';
import { UseGuards } from '@nestjs/common';
import { JSONType } from '@els/server/shared';

@Resolver(() => AccountIdentityMutations)
export class AccountIdentityMutationsResolver {
  private readonly _logger = new Logger(AccountService.name);

  constructor(private readonly _accountService: AccountService) {}

  @ResolveField(() => Session)
  async create(
    @Args('createAccountInput') createAccountInput: CreateAccountInput,
      @Auth() identity: Identity,
  ): Promise<Session> {

    return this._accountService.create(createAccountInput, identity);
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => AccountIdentity)
  async updateProfile(
    @Args('updateProfileInput') updateProfileInput: UpdateProfileInput,
      @Auth() identity: Identity,
  ): Promise<AccountIdentity> {
    try {
      return await this._accountService.updateProfile(identity.sessionId, updateProfileInput);
    } catch (e) {
      throw new exceptions.InternalServerError('Update account error!', this._logger, e);
    }
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => String)
  async preSignAvatarUrl(
    @Auth() identity: Identity,
      @Args('fileName', { type: () => String }) fileName: string,
  ): Promise<string> {
    try {
      return await this._accountService.preSignAvatarUrl(identity, fileName);
    } catch (e) {
      throw new exceptions.InternalServerError('Pre-sign avatar error!', this._logger, e);
    }
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => AccountIdentity, { nullable: true })
  async updatePassword(
    @Args('updatePasswordInput') updatePasswordInput: UpdatePasswordInput,
      @Auth() identity: Identity,
  ): Promise<AccountIdentity> {
    try {
      return await this._accountService.updatePassword(identity, updatePasswordInput);
    } catch (e) {
      return null;
    }
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => String, { nullable: true })
  async checkCurrentPassword(
    @Args('checkCurrentPasswordInput') checkCurrentPasswordInput: CheckCurrentPasswordInput,
      @Auth() identity: Identity,
  ): Promise<Session> {
    console.log(checkCurrentPasswordInput);
    return this._accountService.checkCurrentPassword(identity, checkCurrentPasswordInput);
  }

  @ResolveField(() => Boolean)
  async expirePassword(@Args('accountId') accountId: string): Promise<boolean> {
    try {
      return await this._accountService.passwordExpire(accountId);
    } catch (e) {
      throw new exceptions.InternalServerError('Expire account error!', this._logger, e);
    }
  }

  @ResolveField(() => Boolean)
  async delete(@Auth() identity: Identity): Promise<boolean> {
    try {
      return await this._accountService.delete(identity);
    } catch (error) {
      throw new exceptions.InternalServerError('Delete account error!', this._logger, error);
    }
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => Boolean)
  async requestRecovery(@Args('email') email: string): Promise<boolean> {
    try {
      return await this._accountService.requestAccountRecovery(email);
    } catch (error) {
      throw new exceptions.InternalServerError('Request recovery account error!', this._logger, error);
    }
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => Boolean)
  async requestVerify(@Args('email') email: string): Promise<boolean> {
    try {
      return await this._accountService.verifyAccount(email);
    } catch (error) {
      throw new exceptions.InternalServerError('Request verify account error!', this._logger, error);
    }
  }
}
