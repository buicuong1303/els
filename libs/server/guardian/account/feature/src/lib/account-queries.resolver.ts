import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { AccountIdentityQueries } from '@els/server-guardian-account-data-access-types';
import { AccountAvailableArgs } from '@els/server-guardian-account-data-access-types';
import { AccountService } from '@els/server-guardian-account-data-access-services';
import { Auth, GqlContext, Identity, RedisCacheService } from '@els/server/shared';
import { AccountIdentity } from '@els/server/guardian/common';
import { exceptions } from '@els/server/shared';
@Resolver(() => AccountIdentityQueries)
export class AccountIdentityQueriesResolver {
  private readonly _logger = new Logger(AccountIdentityQueriesResolver.name);
  constructor(
    private readonly _accountService: AccountService,
    private readonly _redisCacheService: RedisCacheService,
  ) {}

  //TODO: need add verifiable address and recovery address to AccountIdentity
  @ResolveField(() => AccountIdentity, {
    description: 'Retrieves the current logged in account or throws a 401 response',
  })
  async current(@Auth() identity: Identity): Promise<AccountIdentity> {
    if(identity.sessionCookie && identity.sessionCookie[0] !== 'undefined') {
      return this._accountService.whoami(undefined, identity.sessionCookie.toString());
    } else {
      if(identity.sessionToken) {
        return this._accountService.whoami(identity.sessionToken, undefined);
      } else {
        throw new exceptions.UnauthorizedError('Not found user', this._logger );
      };
    };
  };

  @ResolveField(() => Boolean, {
    description: 'Check to see if an account by and identity is available',
  })
  async available(@Args() accountAvailableArgs: AccountAvailableArgs): Promise<boolean> {
    return await this._accountService.isAvailable(accountAvailableArgs.identity);
  }

  @ResolveField(() => AccountIdentity)
  async whoami(@Args('idToken') idToken: string): Promise<AccountIdentity> {
    return this._accountService.whoami(idToken);
  }

  @ResolveField(() => String)
  async linkSocialNetwork(@Context() context: GqlContext): Promise<any> {
    // const cookie = `return_to_url=${process.env.APP_URL}; Domain=${process.env.WILDCARD_DOMAIN}; Path=/; HttpOnly; SameSite=Lax`;
    // context.res.header('Set-Cookie', cookie );
    context.res.setCookie(
      'return_to_url',
      `${process.env.APP_URL}`,
      {
        secret: process.env.COOKIE_SECRET,
        domain: process.env.WILDCARD_DOMAIN,
        path: '/',
        httpOnly: true,
      }
    );

    console.log('linkSocialNetwork: ' + JSON.stringify(context.res.cookies));

    return 'success';
  }

  @ResolveField(() => String)
  async logout(@Context() context: GqlContext): Promise<any> {
    // const cookie = `return_to_url=; Domain=${process.env.WILDCARD_DOMAIN}; Expires=Thu, 01 Jan 1970 00:00:00 UTC; Path=/; HttpOnly; SameSite=Lax`;
    // context.res.header('Set-Cookie', cookie );
    let keyStr = '';

    if(context.req.identity && context.req.identity.sessionToken){
      keyStr = context.req.identity.sessionToken;
    } else if(context.req.identity && context.req.identity.sessionCookie) {
      const startPointIndex = context.req.identity.sessionCookie.indexOf('ory_kratos_session');
      const endPointIndex = context.req.identity.sessionCookie.indexOf(';', startPointIndex);

      keyStr = context.req.identity.sessionCookie.slice(startPointIndex, endPointIndex);
    }

    await this._redisCacheService.delete(`data-caching:sessions:${keyStr}`);

    context.res.clearCookie(
      'return_to_url',
      {
        secret: process.env.COOKIE_SECRET,
        domain: process.env.WILDCARD_DOMAIN,
        path: '/',
      }
    );

    return 'success';
  }
}
