/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { exceptions } from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { ExampleTranslation } from '../../../entities/src';
import { CreateExampleTranslationInput } from '../../../types/src';

@Injectable()
export class ExampleTranslationService {
  private readonly _logger = new Logger(ExampleTranslationService.name);

  constructor(
    @InjectRepository(ExampleTranslation)
    private readonly _exampleTranslationRepository: Repository<ExampleTranslation>,
    @InjectRepository(Example)
    private readonly _exampleRepository: Repository<Example>,
    private readonly _connection: Connection
  ) {};

  //* Tạo ví dụ được dich nghĩa
  async createExampleTranslation(createExampleTranslationInput: CreateExampleTranslationInput) {
    const example = await this._exampleRepository.findOne(createExampleTranslationInput.exampleId);

    if(!example) throw new exceptions.NotFoundError('Not found example', this._logger);
    const exampleTranslation = this._exampleTranslationRepository.create(createExampleTranslationInput);
    exampleTranslation.example = example;
    await this._exampleTranslationRepository.save(exampleTranslation);
    return exampleTranslation;
  };

  //* Lấy ví dụ được dich nghĩa
  async getExampleTranslations() {
    const exampleTranslation = await this._exampleTranslationRepository
      .createQueryBuilder('exampleTranslation')
      .leftJoinAndSelect('exampleTranslation.example', 'example')
      .getMany();
    return exampleTranslation;
  };
};
