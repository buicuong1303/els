import { Module } from '@nestjs/common';
import { SessionService } from '@els/server-guardian-session-data-access-services';
import { SessionQueriesResolver } from './session-queries.resolver';
import { SessionMutationsResolver } from './session-mutations.resolver';
import { SessionResolver } from './session.resolver';
import { KratosModule } from '@els/server/guardian/common';

@Module({
  imports: [
    KratosModule
  ],
  providers: [
    SessionResolver,
    SessionMutationsResolver,
    SessionQueriesResolver,
    SessionService,
  ],
  exports: [SessionService],
})
export class SessionModule {}
