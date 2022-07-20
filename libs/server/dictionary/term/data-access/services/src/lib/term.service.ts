/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Term } from 'libs/server/dictionary/common/src/lib/configs/entities-index';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class TermService {
  private readonly _logger = new Logger(TermService.name);
  
  constructor(
    @InjectRepository(Term)
    private readonly _termRepository: Repository<Term>,
    private readonly _connection: Connection
  ) {};

  async findByExampleId(exampleId: string) {
    const terms = await this._termRepository
      .createQueryBuilder('term')
      .leftJoinAndSelect('term.example', 'example')
      .where('example.id = :exampleId', {exampleId})
      .getMany();
    return terms;
  };
};
