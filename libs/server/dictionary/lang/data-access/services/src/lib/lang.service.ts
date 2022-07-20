import { Word } from '@els/server/dictionary/word/data-access/entities';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lang } from '@els/server/dictionary/common';
import { Connection, Repository } from 'typeorm';
import { BaseLang, exceptions } from '@els/server/shared';


@Injectable()
export class LangService {
  private readonly _logger = new Logger(LangService.name);

  constructor(
    @InjectRepository(Word)
    private readonly _wordRepository: Repository<Word>,
    private readonly _connection: Connection,
  ) {};

  async findById(wordId: string): Promise<Lang> {
    const word = await this._wordRepository.findOne({
      relations: ['lang'],
      where: {
        id: wordId
      }
    });

    if(!word) throw new exceptions.NotFoundError('Not found word', this._logger);
    const lang = await this._connection
      .getRepository(BaseLang)
      .createQueryBuilder('lang')
      .where('lang.id = :langId', {langId: word.lang.id })
      .getOne() as Lang;
      
    if(!lang) throw new exceptions.NotFoundError('Not Found', this._logger);
    return lang;
  };
};
