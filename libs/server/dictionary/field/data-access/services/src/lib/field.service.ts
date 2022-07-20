import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { AddWordToFieldInput, CreateFieldInput, GetFieldArgs } from '@els/server/dictionary/field/data-access/types';
import { FieldTb } from '@els/server/dictionary/field/data-access/entities';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { exceptions } from '@els/server/shared';

@Injectable()
export class FieldTbService {
  private readonly _logger = new Logger(FieldTbService.name);

  constructor(
    @InjectRepository(FieldTb)
    private readonly _fieldRepository: Repository<FieldTb>,
    @InjectRepository(Definition)
    private readonly _definitionRepository: Repository<Definition>,
    @InjectRepository(Word)
    private readonly _wordRepository: Repository<Word>,
    private readonly _connection: Connection
  ) {};

  //* Tạo field
  async createFieldTb(createFieldInput: CreateFieldInput) {
    const field = this._fieldRepository.create(createFieldInput); 
    await this._fieldRepository.save(field);
    return field;
  };

  //* Thêm từ và field
  async addWordToField(addWordToFieldInput: AddWordToFieldInput) {
    const field = await this._fieldRepository
      .createQueryBuilder('fieldTb')
      .leftJoinAndSelect('fieldTb.definitions', 'definitions')
      .where('fieldTb.name = :fieldName', {fieldName: addWordToFieldInput.fieldName})
      .getOne();
    if(!field) throw new exceptions.NotFoundError('Not found field', this._logger);

    const definition = await this._definitionRepository
      .createQueryBuilder('definition')
      .where('definition.id = :definitionId', {definitionId: addWordToFieldInput.definitionId})
      .getOne();
    if(!definition) throw new exceptions.NotFoundError('Not found definition', this._logger);

    definition.fieldTb = field;
    await this._definitionRepository.save(definition);
    return field;
  };

  //* Lấy từ trong field
  async getWordInField(getFieldArgs: GetFieldArgs) {
    const field = await this._fieldRepository
      .createQueryBuilder('fieldTb')
      .leftJoinAndSelect('fieldTb.definitions', 'definitions')
      .leftJoinAndSelect('definitions.meaning', 'meaning')
      .leftJoinAndSelect('meaning.word', 'word')
      .where('fieldTb.name = :fieldName', {fieldName: getFieldArgs.name})
      .getOne();
    return field;
  };
};
