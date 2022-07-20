import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import { SessionMutations } from '@els/server-guardian-session-data-access-types';
import { Session, CreateSessionInput } from '@els/server-guardian-session-data-access-types';
import { SessionService } from '@els/server-guardian-session-data-access-services';
import { Auth, Identity, GqlContext } from '@els/server/shared';

@Resolver(() => SessionMutations)
export class SessionMutationsResolver {
  constructor(private readonly _sessionsService: SessionService) {}

  @ResolveField(() => Session)
  async create(
    @Args('createSessionInput') createSessionInput: CreateSessionInput,
      @Auth() identity: Identity,
  ): Promise<Session> {
    return await this._sessionsService.create(createSessionInput, identity);
  }

  @ResolveField(() => Boolean)
  async delete(
    @Auth() identity: Identity,
      @Context() ctx: GqlContext,
  ): Promise<boolean> {
    return await this._sessionsService.delete(identity, ctx);
  }

  @ResolveField(() => Boolean)
  refresh(): boolean {
    return null;
  }
}
