/* eslint-disable @typescript-eslint/no-unused-vars */
import { rule } from 'graphql-shield';
import { GqlContext } from '../../..';

export const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx: GqlContext, info) => {
    return true;
  }
);

export const isAuthorized = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return true;
  }
);

export const isAdmin = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return true;
  }
);

export const isEditor = rule({ cache: 'contextual' })(
  async (parent, args, ctx, info) => {
    return true;
  }
);

export const isOwner = rule({ cache: 'strict' })(
  async (parent, args, ctx, info) => {
    return true;
  }
);
