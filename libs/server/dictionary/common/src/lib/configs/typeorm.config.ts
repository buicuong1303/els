/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

import { BaseLang, DatabaseLogger } from '@els/server/shared';

//* entities
import * as entities from './entities-index';
import { JoinDefinitionConceptMeaningPronunciationWord } from '@els/server/dictionary/join/data-access/entities';
export default class TypeOrmConfig {
  static getOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: +(process.env.POSTGRES_PORT ?? 5432),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [...Object.values(entities), BaseLang, JoinDefinitionConceptMeaningPronunciationWord],
      synchronize: true,
      logger: new DatabaseLogger(),
    };
  }
}
export const typeOrmConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> =>
    TypeOrmConfig.getOrmConfig(),
};
