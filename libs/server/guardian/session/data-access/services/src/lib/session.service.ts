import { Injectable, Logger } from '@nestjs/common';
import { Identity, GqlContext, RedisCacheService } from '@els/server/shared';
import { CreateSessionInput, Session } from '@els/server-guardian-session-data-access-types';
import { KratosService } from '@els/server/guardian/common';
@Injectable()
export class SessionService {
  private readonly _logger = new Logger(SessionService.name);

  constructor(
    private readonly _kratos: KratosService,
    private readonly _redisCacheService: RedisCacheService,
  ) {}

  async create(
    createSessionInput: CreateSessionInput,
    identity: Identity,
  ): Promise<Session> {
    const rsp = await this._kratos.passwordLogin(createSessionInput.identity, createSessionInput.password);
    const sessionToken = rsp.session_token || '';

    identity.remember(sessionToken);

    const session: Session = {
      idToken: sessionToken
    };

    return session;
  }

  async delete(identity: Identity, ctx: GqlContext): Promise<boolean> {
    await this._redisCacheService.delete(`data-caching:sessions:${ctx.req.cookies.idToken ?? identity.sessionToken}`);

    identity.forget();
    await this._kratos.logout(ctx.req.cookies.idToken ?? identity.sessionToken);
    return true;
  }
}
