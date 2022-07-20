import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities'
import { SkillLevelService } from '@els/server/learning/skill-level/data-access/services'
import { SkillLevelResolver } from './skill-level.resolver';
import { SkillLevelMutationsResolver } from './skill-level-mutations.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([SkillLevel])],
  controllers: [],
  providers: [SkillLevelService, SkillLevelResolver, SkillLevelMutationsResolver],
  exports: [SkillLevelService],
})
export class SkillLevelModule {}
