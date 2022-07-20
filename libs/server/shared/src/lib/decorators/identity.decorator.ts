/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Identity } from '../auth';
import { GqlContext } from '../request/gql.context';

//* return Identity object from req of fastify or express
export const Auth = createParamDecorator(
  (data: unknown, context: ExecutionContext): Identity | any => {
    const ctx: GqlContext =
      GqlExecutionContext.create(context).getContext<GqlContext>();

    return ctx?.req?.identity ?? ctx?.req?.raw?.identity ?? null;
  }
);
