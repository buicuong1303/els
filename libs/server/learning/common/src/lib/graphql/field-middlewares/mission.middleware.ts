/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { LearningGqlContext } from '../interfaces/gql-context.interface';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const missionMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn
) => {
  const { info } = ctx;
  const gqlContext: LearningGqlContext = ctx.context;
  await next();
  if (gqlContext.queue && gqlContext.req.identity.account) {
    gqlContext.queue.missionQueue.updateProgressMission(
      info.parentType.toString(),
      info.fieldName,
      info.variableValues,
      gqlContext.req.identity.account
    );
  }
};
