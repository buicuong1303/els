import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

// const whitelist = [
//   'https://guardian.els.com',
//   'http://app.els.com',
//   'https://studio.apollographql.com',
// ];

export const corsOptions: CorsOptions = {
  origin: true,
  // preflightContinue: true,
  credentials: true,
  optionsSuccessStatus: 200,
};

// export const corsApolloOptions: CorsOptions = {
//   origin: whitelist,
//   // preflightContinue: true,
//   credentials: true,
//   optionsSuccessStatus: 200,
//   methods: ['GET', 'POST'],
// };

export const corsWhiteList = [
  process.env.GUARDIAN_URL,
  process.env.APP_URL,
  process.env.APOLLO_URL,
];
