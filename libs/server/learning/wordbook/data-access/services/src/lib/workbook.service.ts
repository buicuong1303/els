/* eslint-disable @typescript-eslint/prefer-for-of */
import { Logger } from '@nestjs/common';
import { Wordbook } from '@els/server/learning/wordbook/data-access/entities';
import { Connection, Repository } from 'typeorm';
import {
  CreateWordBookInput,
  AddWordInput,
} from '@els/server/learning/wordbook/data-access/types';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { exceptions } from '@els/server/shared';
import { User } from '@els/server/learning/user/data-access/entities';
import { Vocabulary } from '@els/server/learning/vocabulary/data-access/entities';
@Injectable()
export class WordbookService {
  private readonly _logger = new Logger(WordbookService.name);
  constructor(
    @InjectRepository(Wordbook)
    private readonly _wordbookRepository: Repository<Wordbook>,
    private readonly _connection: Connection
  ) {}
  async createWordbook(createWordBookInput: CreateWordBookInput) {
    const { name, userId } = createWordBookInput;
    const infoUser = await this._connection.getRepository(User).findOne(userId);
    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);
    const isExistWordbook = await this._wordbookRepository.findOne({
      where: {
        name,
        user: infoUser
      },
    });
    if (isExistWordbook)
      throw new exceptions.ConflictError(
        'Wordbook has been exist',
        this._logger
      );
    

    try {
      const newWordbook = this._wordbookRepository.create(createWordBookInput);
      newWordbook.user = infoUser;
      return this._wordbookRepository.save(newWordbook);
    } catch (error) {
      throw new exceptions.InternalServerError(
        'Internal server',
        this._logger,
        error
      );
    }
  }

  async addWordToWordbook(addWordInput: AddWordInput) {
    const infoWordbook = await this._wordbookRepository.findOne(
      addWordInput.wordbookId
    );
    if (!infoWordbook)
      throw new exceptions.NotFoundError('Not found wordbook', this._logger);

    const infoVocabulary = await this._connection
      .getRepository(Vocabulary)
      .findOne(addWordInput.vocabularyId);
    if (!infoVocabulary)
      throw new exceptions.NotFoundError('Not found vocabulary', this._logger);

    if (infoWordbook.bookmarkWords?.includes(addWordInput.vocabularyId))
      throw new exceptions.ConflictError(
        'Vocabulary has been exist in this wordbook',
        this._logger
      );
    infoWordbook.bookmarkWords = [...infoWordbook.bookmarkWords, addWordInput.vocabularyId];
    return this._wordbookRepository.save(infoWordbook);
  }

  async removeWordToWordbook(removeWordInput: AddWordInput) {
    const infoWordbook = await this._wordbookRepository.findOne(
      removeWordInput.wordbookId
    );
    if (!infoWordbook)
      throw new exceptions.NotFoundError('Not found wordbook', this._logger);

    const indexVocabulary = infoWordbook.bookmarkWords.findIndex((wordId: string) => wordId === removeWordInput.vocabularyId);
    if (indexVocabulary < 0)
      throw new exceptions.NotFoundError(
        'Not found vocabulary in this wordbook',
        this._logger
      );

    infoWordbook.bookmarkWords.splice(indexVocabulary, 1);
    return this._wordbookRepository.save(infoWordbook);
  }

  async findWordBookByUserId(userId: string) {
    return this._connection.getRepository(Wordbook).find({where:{ userId }});
  }

  async getVocabulariesWordbook(wordbookId: string) {
    const wordbook =  await this._connection
      .createQueryBuilder(Wordbook, 'wordbook')
      .leftJoinAndSelect('wordbook.user', 'user')
      .where('wordbook.id = :wordbookId', {wordbookId})
      .getOne();
    if(!wordbook) throw new exceptions.NotFoundError('Not found wordbook', this._logger);
    const listVocabulary = [];
    for(let i = 0; i < wordbook.bookmarkWords.length; i++){
      const vocabularyId = wordbook.bookmarkWords[i];
      const vocabulary = await this._connection
        .createQueryBuilder(Vocabulary, 'vocabulary')
        .where('vocabulary.id = :vocabularyId', {vocabularyId: vocabularyId})
        .getOne();
      if(vocabulary){
        listVocabulary.push(vocabulary);
      }
    }
    return listVocabulary;
  }
}
