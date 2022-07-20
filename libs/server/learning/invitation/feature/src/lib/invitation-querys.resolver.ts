import { ResolveField, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { Auth, AuthGuard, Identity } from '@els/server/shared';
import { InvitationService } from '@els/server/learning/invitation/data-access/services';
import { EmailResponse, InvitationQueries } from '@els/server/learning/invitation/data-access/types';
@Resolver(() => InvitationQueries)
export class InvitationQueriesResolver {
  private readonly _logger = new Logger(InvitationQueriesResolver.name);
  constructor(
    private readonly _invitationService: InvitationService, 
  ) {}

  //TODO: need add verifiable address and recovery address to AccountIdentity
  @ResolveField(() => String, {name: 'getLink'})
  @UseGuards(AuthGuard)
  async getLink(@Auth() identity: Identity) {
    return this._invitationService.encodeRegistrationUrl(identity);
  };

  @ResolveField(() => EmailResponse)
  @UseGuards(AuthGuard)
  async emailInviter(@Auth() identity: Identity) {
    return this._invitationService.emailInviter(identity);
  };
  
}
