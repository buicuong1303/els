/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Logger } from '@nestjs/common';
import { Identity } from '@els/server/shared';
import { exceptions } from '@els/server/shared';
import {
  CreateAccountInput,
  UpdateProfileInput,
  UpdatePasswordInput,
  CheckCurrentPasswordInput
} from '@els/server-guardian-account-data-access-types';
import * as _ from 'lodash';
import { Session } from '@els/server-guardian-session-data-access-types';
import {
  GqlContext as SharedGqlContext,
  LearningGrpcServiceClient,
} from '@els/server/shared';
import {
  AccountIdentity,
  KratosService,
} from '@els/server/guardian/common';
import { lastValueFrom } from 'rxjs';
import { MinIoService } from '@els/server/shared';
import { identity } from 'lodash';

@Injectable()
export class AccountService {
  private readonly _logger = new Logger(AccountService.name);
  constructor(
    private readonly _kratos: KratosService,
    private readonly _learningGrpcServiceClient: LearningGrpcServiceClient,
    private readonly _minIoService: MinIoService
  ) {}

  async create(
    createAccountInput: CreateAccountInput,
    identity: Identity
  ): Promise<Session> {
    const { password } = createAccountInput;

    if (!createAccountInput.email || !createAccountInput.username) {
      throw new exceptions.BadRequestError(
        'email and username field must be provided',
        this._logger
      );
    };

    const traits = _.omit(createAccountInput, ['password', 'confirmPassword', 'userInvitedId']);

    const resp = await this._kratos.passwordRegistration(traits, password);


    const session: Session = {
      idToken: resp.session_token,
    };

    //TODO: need review
    const rs = await lastValueFrom(
      this._learningGrpcServiceClient.svc.createUser({
        identityId: resp.identity.id
      })
    );

    if (session.idToken) {
      identity.remember(session.idToken);

      return session;
    } else {
      throw new exceptions.InternalServerError(
        'Register account error!',
        this._logger,
        null
      );
    }
  }

  //TODO: need check phone, email or username is existing
  async isAvailable(identity: string): Promise<boolean> {
    return false;
  }

  //TODO: need implement
  async passwordExpire(sessionId: string): Promise<boolean> {
    return false;
  }

  async updateProfile(
    sessionId: string,
    updateProfileInput: UpdateProfileInput
  ): Promise<AccountIdentity> {
    // if (updateProfileInput.phoneNumber) {
    //   payload.phoneNumber = `${updateProfileInput.phoneNumber.prefix}-${updateProfileInput.phoneNumber.digit}`;
    // }

    const preTraits = await this._kratos.whoami(sessionId);

    const traits = {
      ...preTraits.traits,
      ...updateProfileInput,
    };

    return this._kratos.updateProfile(sessionId, traits);
  }

  async preSignAvatarUrl(identity: Identity, fileName: string): Promise<string> {
    const path = `avatars/${identity.account?.id}/${fileName}`;

    return this._minIoService.getPresignedUrl(process.env.MINIO_BUCKET_NAME || 'els', path);
  }

  async updatePassword(
    identity: Identity,
    updatePasswordInput: UpdatePasswordInput
  ): Promise<AccountIdentity|null> {
    const identityString = identity.account?.username ??  identity.account?.email;
    if(!identityString) throw new exceptions.InternalServerError('Account is not existing!', this._logger, null);
    const data = await this._kratos.passwordLogin(identityString, updatePasswordInput.currentPassword);

    if(data && data.session_token) {
      const accountIdentity: AccountIdentity = await this._kratos.updatePassword(data.session_token, updatePasswordInput.password);
      await this._kratos.logout(data.session_token);
      return accountIdentity;
    } else {
      throw new exceptions.NotFoundError('Old password fail', this._logger);
    }
  }

  async checkCurrentPassword(
    identity: Identity,
    checkCurrentPasswordInput: CheckCurrentPasswordInput
  ): Promise<any> {
    const identityString = identity.account?.username ??  identity.account?.email;
    if(!identityString) throw new exceptions.InternalServerError('Account is not existing!', this._logger, null);
    const data = await this._kratos.passwordLogin(identityString, checkCurrentPasswordInput.currentPassword);
    if (data) return 'success';
  }


  async requestAccountRecovery(
    email: string,
    token?: string
  ): Promise<boolean> {
    const resp = await this._kratos.accountRecovery(email, token);
    return !!resp;
  }

  async verifyAccount(email: string, token?: string): Promise<boolean> {
    const resp = await this._kratos.verifyAccount(email, token);
    return !!resp;
  }

  //TODO: need implement
  async delete(identity: Identity): Promise<boolean> {
    return false;
  }

  async whoami(
    sessionId: any,
    sessionCookie?: string
  ): Promise<AccountIdentity> {
    return this._kratos.whoami(sessionId, sessionCookie);
  }

  async getInfo(identityId: string): Promise<AccountIdentity | null> {
    return this._kratos.getAccountInfo(identityId);
  }

  async getListInfo(): Promise<[AccountIdentity]> {
    return this._kratos.getAccountsInfo();
  }
}
