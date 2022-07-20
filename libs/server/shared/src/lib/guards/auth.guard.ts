/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { checkCache, GqlContext } from '@els/server/shared';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticateRequest } from '../protobuf/guardian';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context).getContext();
    return await AuthGuard.verifyCurrentSession(ctx);
  }

  private static async verifyCurrentSession(ctx: GqlContext): Promise<boolean> {
    const request: AuthenticateRequest = {
      sessionToken: ctx.req.identity.sessionToken,
      sessionCookie: ctx.req.identity.sessionCookie,
    };

    if(!request.sessionToken && !request.sessionCookie) {
      return false;
    }

    if(request.sessionCookie && !request.sessionCookie.includes('ory_kratos_session')) {
      console.log(`${new Date()}: Error at AuthGuard learning`);
      return false;
    }

    try {
      const expiredTime = process?.env?.AUTH_GUARD_EXPIRED_TIME || '3600';
      let keyStr = '';

      if(request.sessionToken) {
        keyStr = request.sessionToken;
      } else if(request.sessionCookie){
        const startPointIndex = request.sessionCookie.indexOf('ory_kratos_session');
        const endPointIndex = request.sessionCookie.indexOf(';', startPointIndex);
        keyStr = request.sessionCookie.slice(startPointIndex, endPointIndex);
      }

      const account = await checkCache(ctx.cache, `data-caching:sessions:${keyStr}`,
        () => ctx.rpc.guardian.authenticate(request), parseInt(expiredTime));

      if (account) {
        ctx.req.identity.updateAccount(account);
        return true;
      };

      return false;
    } catch (error) {
      return false;
    }
  }
}
