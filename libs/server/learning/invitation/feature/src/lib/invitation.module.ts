/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { InvitationService } from '@els/server/learning/invitation/data-access/services';
import { Module } from '@nestjs/common';
import { InvitationResolver } from './invitation.resolver';
import { InvitationMutationsResolver } from './invitation-mutations.resolver';
import { InvitationQueriesResolver } from './invitation-querys.resolver';
import { MissionQueueModule } from '@els/server/learning/queues';

@Module({
  imports: [MissionQueueModule],
  providers: [
    InvitationResolver,
    InvitationMutationsResolver,
    InvitationQueriesResolver,
    InvitationService
  ],
  exports: [InvitationService],
})
export class InvitationModule {}
