/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Skill } from '@els/server/learning/skill/data-access/entities';
import { UpdateSkillInput } from '@els/server/learning/skill/data-access/types';
import { exceptions } from '@els/server/shared';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

export class SkillService {
  private readonly _logger = new Logger(SkillService.name);
  constructor(
    @InjectRepository(Skill)
    private readonly _skillRepository: Repository<Skill>,
  ) {}
  async getSkillsByIds(ids: string[]) {
    return this._skillRepository.find({
      where: {
        id: In(ids),
      },
    });
  }
  async updateSkill(updateSkillInput: UpdateSkillInput) {
    const { skillId } = updateSkillInput;
    const infoSkill = await this._skillRepository.findOne(skillId);

    if (!infoSkill) throw new exceptions.NotFoundError('Not found skill', this._logger);

    infoSkill.name = updateSkillInput.name;
    return this._skillRepository.save(infoSkill);
  }
}
