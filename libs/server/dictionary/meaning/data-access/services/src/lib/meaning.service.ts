import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { Connection, Repository } from 'typeorm';
import { Pos } from '@els/server/dictionary/pos/data-access/entities';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
@Injectable()
export class MeaningService {
  private readonly _logger = new Logger(MeaningService.name);

  constructor(
    @InjectRepository(Pos)
    private readonly _posRepository: Repository<Pos>,
    @InjectRepository(Definition)
    private readonly _definitionRepository: Repository<Definition>,
    private readonly _connection: Connection
  ) {};

  async findByWordId(wordId: string): Promise<Meaning[]> {
    const meaning = await this._connection
      .getRepository(Meaning)
      .createQueryBuilder('meaning')
      .leftJoinAndSelect('meaning.pos', 'pos')
      .leftJoinAndSelect('meaning.definitions', 'definitions')
      .leftJoinAndSelect('definitions.examples', 'examples')
      .leftJoinAndSelect('examples.exampleTranslations', 'exampleTranslations')
      .leftJoinAndSelect('examples.terms', 'terms')
      .leftJoinAndSelect('definitions.pronunciation', 'pronunciation')
      .leftJoinAndSelect('definitions.joins', 'joins')
      .leftJoinAndSelect('joins.concept', 'concept')
      .where('meaning.wordId = :wordId', {wordId})
      .getMany();
    return meaning;
  };

  async findPosById(meaningId: string) {
    const pos = await this._posRepository
      .createQueryBuilder('pos')
      .leftJoinAndSelect('pos.meanings', 'meanings')
      .where('meanings.id = :meaningId', {meaningId})
      .getOne();
    return pos;
  };

  async findDefinitionsById(meaningId: string) {
    const definitions = await this._definitionRepository
      .createQueryBuilder('definitions')
      .leftJoinAndSelect('definitions.meaning', 'meaning')
      .where('meaning.id = :meaningId', {meaningId})
      .getMany();
    return definitions;
  };
};
