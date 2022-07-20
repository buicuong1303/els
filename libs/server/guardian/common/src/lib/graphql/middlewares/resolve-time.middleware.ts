/* eslint-disable @typescript-eslint/no-unused-vars */
import { MiddlewareFn } from 'type-graphql';
export const LogAccess: MiddlewareFn = ({ context, info }, next) => {
  return next();
};