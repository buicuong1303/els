/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contain } from 'libs/server/dictionary/common/src/lib/configs/entities-index';
import { Connection, Repository } from 'typeorm';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';

@Injectable()
export class ContainService {
  private readonly _logger = new Logger(ContainService.name);
  constructor(
    @InjectRepository(Contain)
    private readonly _containRepository: Repository<Contain>,
    @InjectRepository(Phrase)
    private readonly _phraseRepository: Repository<Phrase>,
    private readonly _connection: Connection
  ) {};

  async findByWordId(wordId: string) {
    const contain = await this._containRepository
      .createQueryBuilder('contain')
      .leftJoinAndSelect('contain.word', 'word')
      .leftJoinAndSelect('contain.phrase', 'phrase')
      .where('word.id = :wordId', { wordId })
      .getMany();
    return contain;
  };

  async findPhraseByContainId(containId: string) {
    const phrase = await this._phraseRepository
      .createQueryBuilder('phrase')
      .leftJoinAndSelect('phrase.contains', 'contains')
      .where('contains.id = :containId', { containId })
      .getOne();
    return phrase;
  };
};
