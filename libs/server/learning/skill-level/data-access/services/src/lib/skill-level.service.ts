/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Level } from '@els/server/learning/level/data-access/entities';
import { SkillLevel } from '@els/server/learning/skill-level/data-access/entities';
import { CreateSkillLevelInput, UpdateSkillLevelInput } from '@els/server/learning/skill-level/data-access/types';
import { Skill } from '@els/server/learning/skill/data-access/entities';
import { exceptions } from '@els/server/shared';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

export class SkillLevelService {
  private readonly _logger = new Logger(SkillLevelService.name);
  constructor(
    @InjectRepository(SkillLevel)
    private readonly _skillLevelRepository: Repository<SkillLevel>,

    private readonly _connection: Connection
  ) {}
  async findById(id: string | undefined) {
    if (!id) return;
    return this._skillLevelRepository.findOne(id);
  }
  async createSkillLevel( createSkillLevelInput: CreateSkillLevelInput ) {
    const {levelId, skillId} = createSkillLevelInput;

    const infoLevel = await this._connection.getRepository(Level).findOne(levelId);
    if (!infoLevel) throw new exceptions.NotFoundError('Not found level', this._logger);

    const infoSkill = await this._connection.getRepository(Skill).findOne(skillId);
    if (!infoSkill) throw new exceptions.NotFoundError('Not found skill', this._logger);

    const newSkillLevel = this._skillLevelRepository.create(createSkillLevelInput);
    newSkillLevel.level = infoLevel;
    newSkillLevel.skill = infoSkill;
    return this._skillLevelRepository.save(newSkillLevel);

  }

  async updateSkillLevel(updateSkillLevelInput: UpdateSkillLevelInput) {
    const infoSkillLevel = await this._skillLevelRepository.findOne(updateSkillLevelInput.skillLevelId);
    if (!infoSkillLevel) throw new exceptions.NotFoundError('Not found', this._logger);
    infoSkillLevel.alpha = updateSkillLevelInput.alpha;
    return this._skillLevelRepository.save(infoSkillLevel);
  }
 
}
