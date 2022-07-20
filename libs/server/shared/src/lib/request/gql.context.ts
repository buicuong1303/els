/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { FastifyRequest, FastifyReply } from 'fastify';
import { GuardianGrpcServiceClient } from '../..';
import { Identity } from '../auth';
import { RedisCache } from 'apollo-server-cache-redis';


export interface IRequest extends ExpressRequest {
  identity: Identity;
}
export interface IResponse extends ExpressResponse {
  cookies: Record<string, string> & { idToken?: string };
  clearCookie: (cookie: string, options?: any) => any;
  setCookie: (key: string, value: string, options?: any) => any;
}

export interface IFastifyRequest extends FastifyRequest {
  identity: Identity;
  cookies: Record<string, string> & { idToken: string };
  raw: FastifyRequest['raw'] & { identity?: Identity };
}

export interface IFastifyReply extends FastifyReply {
  cookies: Record<string, string> & { idToken?: string };
  clearCookie: (cookie: string, options?: any) => any;
  setCookie: (key: string, value: string, options?: any) => any;
}

export interface GqlContext {
  connection?: any;
  cache: RedisCache;

  //* express
  // req?: Partial<IRequest>;
  // res?: Partial<ExpressResponse>

  //* fastify
  req: IFastifyRequest;
  res: IFastifyReply;
  payload: any;
  rpc: {
    guardian:GuardianGrpcServiceClient
  },
}

export interface GqlContextExpress {
  cache: RedisCache;
  connection?: any;

  //* express
  payload: any;
  rpc: {
    guardian:GuardianGrpcServiceClient
  },
  identity: any
}
