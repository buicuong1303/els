import { Level } from '@els/server/learning/level/data-access/entities';
import { CreateLevelInput } from '@els/server/learning/level/data-access/types';
import { exceptions } from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class LevelService {
  private readonly _logger = new Logger(LevelService.name);
  constructor(
    @InjectRepository(Level)
    private readonly _levelRepository: Repository<Level>
  ) {}

  async createLevel(createLevelInput: CreateLevelInput) {
    const { level } = createLevelInput;
    const isExistLevel = await this._levelRepository.findOne({
      where: {
        level,
      },
    });
    if (isExistLevel)
      throw new exceptions.ConflictError('Level has been exist', this._logger);
    const newLevel = this._levelRepository.create(createLevelInput);
    return this._levelRepository.save(newLevel);
  }

  async getLevels() {
    return this._levelRepository.find();
  }
}
