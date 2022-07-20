/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhraseTranslation } from 'libs/server/dictionary/common/src/lib/configs/entities-index';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class PhraseTranslationService {
  private readonly _logger = new Logger(PhraseTranslationService.name);
  
  constructor(
    @InjectRepository(PhraseTranslation)
    private readonly _phraseTranslationRepository: Repository<PhraseTranslation>,
    @InjectRepository(Phrase)
    private readonly _phraseRepository: Repository<Phrase>,
    private readonly _connection: Connection
  ) {};

  async findById(phrase: Phrase) {
    const phraseTranslate = await this._phraseTranslationRepository
      .createQueryBuilder('phraseTranslate')
      .leftJoinAndSelect('phraseTranslate.phrase', 'phrase')
      .where('phrase.id = :phraseId', {phraseId: phrase.id})
      .getMany();
    return phraseTranslate;
  };
};
