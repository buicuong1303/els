import { Injectable, Logger } from '@nestjs/common';
import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreatePronunciationInput } from '@els/server/dictionary/pronunciation/data-access/types';
import { exceptions } from '@els/server/shared';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';


@Injectable()
export class PronunciationService {
  private readonly _logger = new Logger(PronunciationService.name);

  constructor(
    @InjectRepository(Pronunciation)
    private readonly _pronunciationRepository: Repository<Pronunciation>,
    private readonly _connection: Connection
  ) {};

  async createPronunciation(createPronunciationInput: CreatePronunciationInput) {
    try {
      const pronunciation = this._pronunciationRepository.create(createPronunciationInput);
      return await this._pronunciationRepository.save(pronunciation);
    } catch(error) {    
      throw new exceptions.InternalServerError(
        'Internal server',
        this._logger,
        error
      );
    };
  };

  //* Get phonetic cho phần federation
  async getPhonetic(text: string, lang: string, pos: string) {
    const word = await this._connection
      .getRepository(Word)
      .createQueryBuilder('word')
      .leftJoin('word.lang', 'lang')
      .where('word.text = :text', {text})
      .andWhere('lang.code = :code', {code: lang})
      .getOne();

    if(!word) {
      const phrase = await this._connection
        .createQueryBuilder(Phrase, 'phrase')
        .where('phrase.text = :text', {text})
        .andWhere('phrase.lang = :code', {code: lang})
        .getOne();

      return {
        pronunciation: [],
        word: phrase,
        type: 'phrase'
      };

    } else {
      const pronunciation = await this._connection
        .getRepository(Pronunciation)
        .createQueryBuilder('pronunciation')
        .leftJoinAndSelect('pronunciation.definitions', 'definitions')
        .leftJoinAndSelect('definitions.meaning', 'meaning')
        .leftJoinAndSelect('meaning.pos', 'pos')
        .leftJoinAndSelect('meaning.word', 'word')
        .leftJoinAndSelect('word.lang', 'lang')
        .where('word.text = :text', {text})
        .andWhere('lang.code = :code', {code: lang})
        .andWhere('pos.name = :pos', {pos})
        .getMany();

      const pronunciationData = pronunciation.map(item => {
        return {
          phonetic: item.phonetic,
          audioUri: item.audioUri,
        };
      });

      return {
        pronunciation: pronunciationData,
        word: word,
        type: 'word'
      };
    }
  };
};
