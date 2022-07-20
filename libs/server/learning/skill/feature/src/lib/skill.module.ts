import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from '@els/server/learning/skill/data-access/entities';
import { SkillService } from '@els/server/learning/skill/data-access/services';
import { SkillMutationsResolver } from './skill-mutations.resolver';
import { SkillResolver } from './skill.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([Skill])],
  controllers: [],
  providers: [SkillService, SkillMutationsResolver, SkillResolver],
  exports: [SkillService],
})
export class SkillModule {}
