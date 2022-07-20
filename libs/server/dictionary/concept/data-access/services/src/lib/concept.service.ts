import { Connection, Repository } from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Concept } from '@els/server/dictionary/concept/data-access/entities';
import { CreateConceptInput } from '@els/server/dictionary/concept/data-access/types';
import { exceptions } from '@els/server/shared';

@Injectable()
export class ConceptService {
  private readonly _logger = new Logger(ConceptService.name);
  constructor(
    @InjectRepository(Concept)
    private readonly _conceptRepository: Repository<Concept>,
    private readonly _connection: Connection
  ) {}

  async createConcept(createConceptInput: CreateConceptInput) {
    try {
      const concept = this._conceptRepository.create(createConceptInput);
      return await this._conceptRepository.save(concept);
    } catch (error) {
      throw new exceptions.InternalServerError(
        'Internal server',
        this._logger,
        error
      );
    };
  };
};
