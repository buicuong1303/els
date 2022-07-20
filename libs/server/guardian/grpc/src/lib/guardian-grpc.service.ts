/* eslint-disable @typescript-eslint/no-unused-vars */
import { AccountService } from '@els/server-guardian-account-data-access-services';
import { AccountIdentity } from '@els/server/guardian/common';
import { exceptions, protobuf } from '@els/server/shared';
import { trycat } from '@els/shared/utils';
import { Controller, Logger } from '@nestjs/common';
import { Metadata } from 'grpc';
@protobuf.GUARDIAN.GuardianServiceControllerMethods()
@Controller()
export class GuardianGrpcService
implements protobuf.GUARDIAN.GuardianServiceController {
  private readonly _logger = new Logger(GuardianGrpcService.name);

  constructor(private readonly _accountService: AccountService) {}

  async authenticate(
    request: protobuf.GUARDIAN.AuthenticateRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<protobuf.GUARDIAN.AuthenticateResponse> {
    const [data, e] = await trycat(
      this._accountService.whoami(request.sessionToken, request.sessionCookie)
    );

    if (e) {
      this._logger.debug(`sessionToken: ${request.sessionToken}`);
      this._logger.debug(`sessionCookie: ${request.sessionCookie}`);
      throw new exceptions.UnauthorizedError('', this._logger, e);
    }

    const identity = new AccountIdentity(data);

    const payload: protobuf.GUARDIAN.AuthenticateResponse = {
      id: identity.id || '',
      firstName: identity.traits.firstName,
      middleName: identity.traits.middleName,
      lastName: identity.traits.lastName,
      username: identity.traits.username,
      email: identity.traits.email,
      picture: identity.traits.picture,
    };

    return payload;
  }

  async getIdentity(
    request: protobuf.GUARDIAN.GetIdentityRequest,
    metadata?: Metadata,
    ...rest: any
  ): Promise<protobuf.GUARDIAN.GetIdentityResponse> {
    const [data, e] = await trycat(this._accountService.getInfo(request.id));

    if (e) {
      throw new exceptions.InternalServerError('', this._logger, e);
    }

    return {
      firstName: data.traits.firstName,
      lastName: data.traits.lastName,
      id: data.id,
      middleName: data.traits.middleName,
      picture: data.traits.picture,
    };
  }

  async getIdentities(
    metadata?: Metadata,
    ...rest: any
  ): Promise<protobuf.GUARDIAN.GetIdentitiesResponse> {
    const [data, e] = await trycat(this._accountService.getListInfo());

    if (e) {
      throw new exceptions.InternalServerError('', this._logger, e);
    }

    const identities = data.map(item => {
      return {
        firstName: item.traits.firstName,
        lastName: item.traits.lastName,
        id: item.id,
        middleName: item.traits.middleName,
        picture: item.traits.picture,
      };
    });

    return { identities };
  }
}

