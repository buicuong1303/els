/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ActualSkill, MemoryAnalysis } from '@els/server/learning/memory-analysis/data-access/entities';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';


export class MemoryAnalysisService {
  private readonly _logger = new Logger(MemoryAnalysisService.name);
  constructor(
    @InjectRepository(MemoryAnalysis)
    private readonly _memoryAnalysisRepository: Repository<MemoryAnalysis>,

    private readonly _connection: Connection
  ) {}
  async findActualSkillsByMemoryAnalysisId(memoryAnalysisId: string) {
    return await this._connection.getRepository(ActualSkill).find({
      where: {
        memoryAnalysisId
      }
    });
  }
 
}
