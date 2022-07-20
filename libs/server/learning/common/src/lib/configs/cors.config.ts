import { corsWhiteList } from '@els/server/graphql-federation-gateway/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export const corsOptions: CorsOptions = {
  origin: true,
  // preflightContinue: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

export const corsApolloOptions: CorsOptions = {
  origin: corsWhiteList,
  // preflightContinue: true,
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST'],
};
