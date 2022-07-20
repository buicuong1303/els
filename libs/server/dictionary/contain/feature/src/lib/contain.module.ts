/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contain } from '@els/server/dictionary/contain/data-access/entities';
import { ContainService } from '@els/server/dictionary/contain/data-access/services';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { ContainResolver } from './contain.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([
    Contain,
    Phrase
  ])
  ],
  controllers: [],
  providers: [
    ContainService,
    ContainResolver
  ],
  exports: [ContainService],
})
export class ContainModule {};
