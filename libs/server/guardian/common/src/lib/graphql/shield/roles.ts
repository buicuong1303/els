/* eslint-disable @typescript-eslint/no-unused-vars */
import { rule } from 'graphql-shield';
import { GqlContext } from '@els/server/shared';

export const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx: GqlContext, info) => {
    console.log('shield-guardian');
    return true;
  }
);

export const isAuthorized = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    // logger.debug('rule isAuthenticated');
    return true;
    // return ctx.user !== null;
  }
);

export const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    // logger.debug('rule isAdmin');
    return true;
    // return ctx.user.role === 'admin'
  }
);

export const isEditor = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    // logger.debug('rule isEditor');
    return true;
    // return ctx.user.role === 'editor'
  }
);

export const isOwner = rule({ cache: 'strict' })(
  async (parent, args, ctx, info) => {
    // logger.debug('rule isOwner');
    return true;
    // return ctx.user.items.some((id: string) => id === parent.id)
  }
);
