/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryAnalysis } from '@els/server/learning/memory-analysis/data-access/entities';
import { MemoryAnalysisService } from '@els/server/learning/memory-analysis/data-access/services';
import { MemoryAnalysisResolver } from './memory-analysis.resolver';
import { ActualSkillResolver } from './actual-skill.resolver';
import { SkillLevelModule } from '@els/server/learning/skill-level/feature';

@Module({
  imports: [TypeOrmModule.forFeature([MemoryAnalysis]), SkillLevelModule],
  controllers: [],
  providers: [
    MemoryAnalysisResolver,
    MemoryAnalysisService,
    ActualSkillResolver,
  ],
  exports: [MemoryAnalysisService],
})
export class MemoryAnalysisModule {}
