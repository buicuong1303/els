import { SessionService } from '@els/server-guardian-session-data-access-services';
import { SessionQueries } from '@els/server-guardian-session-data-access-types';
import { ResolveField, Resolver } from '@nestjs/graphql';

@Resolver(() => SessionQueries)
export class SessionQueriesResolver {
  constructor(private readonly _sessionsService: SessionService) {}

  @ResolveField(() => Boolean)
  passwordlessToken(): boolean {
    return null;
  }
}
