/* eslint-disable @typescript-eslint/no-unused-vars */
import { Logger } from '@nestjs/common';
import { rule } from 'graphql-shield';
import { GqlContext } from '../../configs';

const logger = new Logger('Graphql Shield');

//TODO: let define logic
export const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, ctx: GqlContext, info) => {
    const identity = ctx.req?.identity ?? ctx.req?.raw?.identity;
    if(!identity) return true;
    return false;
  }
);

//TODO: let define logic
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
