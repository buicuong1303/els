import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { Logger, UseGuards } from '@nestjs/common';
import { Auth, AuthGuard, Identity } from '@els/server/shared';
import { InvitationService } from '@els/server/learning/invitation/data-access/services';
import { InvitationAcceptInput, InvitationMutations } from '@els/server/learning/invitation/data-access/types';


@Resolver(() => InvitationMutations)
export class InvitationMutationsResolver {
  private readonly _logger = new Logger(InvitationMutationsResolver.name);

  constructor(
    private readonly _invitationService: InvitationService,
  ) {}

  @ResolveField(() => String, {name: 'accept', nullable: true})
  @UseGuards(AuthGuard)
  async acceptInvitation(@Auth() identity: Identity, @Args('invitationAcceptInput') invitationAcceptInput: InvitationAcceptInput) {
    return this._invitationService.acceptInvitation(identity, invitationAcceptInput.inviterId);
  };
  
}
