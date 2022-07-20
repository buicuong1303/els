/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { SpecializationService } from '@els/server/learning/specialization/data-access/services'
import { Specialization } from '@els/server/learning/specialization/data-access/entities'
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecializationResolver } from './specialization.resolver';
@Module({
  imports: [ TypeOrmModule.forFeature([Specialization])],
  controllers: [],
  providers: [SpecializationService, SpecializationResolver],
  exports: [SpecializationService],
})
export class SpecializationModule {}
