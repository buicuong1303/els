/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Concept } from '@els/server/dictionary/concept/data-access/entities';
import { Contain } from '@els/server/dictionary/contain/data-access/entities';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Join } from '@els/server/dictionary/join/data-access/entities';
import { Lang } from '@els/server/dictionary/lang/data-access/entities';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { Pos } from '@els/server/dictionary/pos/data-access/entities';
import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { AddPhraseInput, CreateWordInput, FindWordArgs, GetWordArgs, SetWordPosInput } from '@els/server/dictionary/word/data-access/types';
import { BaseLang, exceptions, pagination } from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
@Injectable()
export class WordService {
  private readonly _logger = new Logger(WordService.name);
  constructor(
    @InjectRepository(Word)
    private readonly _wordRepository: Repository<Word>,
    @InjectRepository(Meaning)
    private readonly _meaningRepository: Repository<Meaning>,
    @InjectRepository(Definition)
    private readonly _definitionRepository: Repository<Definition>,
    @InjectRepository(Pronunciation)
    private readonly _pronunciationRepository: Repository<Pronunciation>,
    @InjectRepository(Join)
    private readonly _joinRepository: Repository<Join>,
    @InjectRepository(Contain)
    private readonly _containRepository: Repository<Contain>,
    private readonly _connection: Connection,
  ) {};

  private _checkPosWithWordExisted(word: Word, pos: Pos) {
    const conceptApply = word.meanings.filter(item => {
      if(item.pos?.name === pos.name){
        return true;
      };
      return false;
    });
    return conceptApply;
  }

  private _checkDescriptionConflict(meanings: Meaning[], description: string) {
    return  meanings.filter(item => {
      const existed = item.definitions.filter(element => {
        if(element.description === description) {
          return true;
        }
        return false;
      });
      if(existed.length > 0){
        return true;
      };
      return false;
    });
  }

  private async _handleWordNotExisted(lang: Lang, pos: Pos, createWordInput: CreateWordInput, description: string, text: string) {
    //*Tạo từ
    const word = this._wordRepository.create(createWordInput);
    word.lang = lang;
    await this._wordRepository.save(word);

    //*Tạo meaning (từ với loại từ)
    const meaning = this._meaningRepository.create();
    meaning.pos = pos;
    meaning.word = word;
    await this._meaningRepository.save(meaning);

    //*Tạo phát âm
    const pronunciation = this._pronunciationRepository.create(createWordInput);
    await this._pronunciationRepository.save(pronunciation);

    //*Tạo phát nghĩa
    const definition = this._definitionRepository.create(createWordInput);
    definition.meaning = meaning;
    definition.pronunciation = pronunciation;
    await this._definitionRepository.save(definition);

    //* Kiểm tra concept tồn tại chưa
    const conceptExisted =  await this._wordRepository
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.lang', 'lang')
      .leftJoinAndSelect('word.meanings', 'meanings')
      .leftJoinAndSelect('meanings.pos', 'pos')
      .leftJoinAndSelect('meanings.definitions', 'definitions')
      .leftJoinAndSelect('definitions.joins', 'joins')
      .leftJoinAndSelect('joins.concept', 'concept')
      .where('definitions.description = :description', {description})
      .andWhere('word.text != :text', {text})
      .getOne();

    if(!conceptExisted) { //* Neu Concept chưa tồn tại
      //* Tạo concept và join vào concept
      const concept = this._connection.manager.create(Concept);
      await this._connection.manager.save(concept);
      const join = this._joinRepository.create();
      join.definition = definition;
      join.concept = concept;
      await this._joinRepository.save(join);
      return word;
    } else { //* Concept đã tồn tại
    //* Kiểm tra concept có cùng ngôn ngữ không
      const conceptApply = this._checkPosWithWordExisted(conceptExisted, pos);

      if(conceptApply.length > 0){
      //* Đã có concept thì kiểm tra và lấy ra concept, sau đó tạo definition và join vào concept
        let definitionIndex = 0;
        conceptApply[0].definitions.forEach((item, index) => {
          if(item.description === description) {
            definitionIndex = index;
          };
        });

        const join = this._joinRepository.create();
        join.definition = definition;
        join.concept = conceptApply[0].definitions[definitionIndex].joins[0].concept;
        await this._joinRepository.save(join);
        return word;
      }
      return word;
    }
  }

  private async _handleWordExisted(lang: Lang, pos: Pos, createWordInput: CreateWordInput, description: string, wordExisted: Word) {
    const concept = this._connection.manager.create(Concept);
    const join = this._joinRepository.create();
    const pronunciation = this._pronunciationRepository.create(createWordInput);
    const definition = this._definitionRepository.create(createWordInput);

    //* Kiểm tra từ có cùng pos không
    const posExisted = this._checkPosWithWordExisted(wordExisted, pos);

    if(posExisted.length > 0) { //* Từ trùng pos
      //* Kiểm tra xem từ có trùng description không
      const descriptionExisted = this._checkDescriptionConflict(posExisted, description);

      if(descriptionExisted.length > 0){ //* Word trùng description --> báo conflict
        throw new exceptions.ConflictError('word conflict',  this._logger);
      };
      //* Từ không trùng description
      //* Kiểm tra definition tồn tại chưa

      const definitionExisted = await this._definitionRepository
        .createQueryBuilder('definition')
        .leftJoinAndSelect('definition.joins', 'joins')
        .leftJoinAndSelect('joins.concept', 'concept')
        .where('definition.description = :description', {description})
        .getOne();

      if(!definitionExisted){ //* definition chưa tồn tại
        //* Tạo phát âm
        await this._pronunciationRepository.save(pronunciation);

        //* Tạo định nghĩa
        definition.meaning = posExisted[0];
        definition.pronunciation = pronunciation;
        await this._definitionRepository.save(definition);

        //* Tạo concept
        await this._connection.manager.save(concept);

        //* Tạo join và join vào concept
        join.definition = definition;
        join.concept = concept;
        await this._joinRepository.save(join);

        return wordExisted;
      }
      //* definition đã tồn tại
      //* Tạo phát âm
      await this._pronunciationRepository.save(pronunciation);

      //* Tạo định nghĩa
      definition.meaning = posExisted[0];
      definition.pronunciation = pronunciation;
      await this._definitionRepository.save(definition);

      //* Tạo join vào join vào concept
      join.definition = definition;
      //* lấy join[0] vì các join này đêu có chung concept
      join.concept = definitionExisted.joins[0].concept;
      await this._joinRepository.save(join);

      return wordExisted;
    };
    //* Từ khác pos
    //* Tạo meaning
    const meaning = this._meaningRepository.create();
    meaning.pos = pos;
    meaning.word = wordExisted;
    await this._meaningRepository.save(meaning);

    //* Tạo phát âm
    await this._pronunciationRepository.save(pronunciation);

    //* Tạo định nghĩa
    definition.meaning = meaning;
    definition.pronunciation = pronunciation;
    await this._definitionRepository.save(definition);

    //* Tạo concept
    await this._connection.manager.save(concept);

    //* Tạo join và join vào concept
    join.definition = definition;
    join.concept = concept;
    await this._joinRepository.save(join);

    return wordExisted;
  }

  async createWord(createWordInput: CreateWordInput) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {text, langId, posId, description } = createWordInput;
    const lang = await this._connection.getRepository(BaseLang).findOne(langId) as Lang;
    const pos = await this._connection.getRepository(Pos).findOne(posId);
    if (!pos || !lang) throw new exceptions.NotFoundError('Not found', this._logger);

    //* Kiểm tra từ đã có chưa
    const wordExisted = await this._wordRepository
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.lang', 'lang')
      .leftJoinAndSelect('word.meanings', 'meanings')
      .leftJoinAndSelect('meanings.pos', 'pos')
      .leftJoinAndSelect('meanings.definitions', 'definitions')
      .where('word.text = :text', {text})
      .andWhere('lang.id = :langId', {langId})
      .getOne();

    try {
      if(!wordExisted) { //* Từ chưa có
        const word = await this._handleWordNotExisted(lang, pos, createWordInput, description, text);
        return word;
      } else { //* Từ đã có
        const word = await this._handleWordExisted(lang, pos, createWordInput, description, wordExisted);
        return word;
      }
    } catch(error) {
      throw new exceptions.InternalServerError(
        'Internal server',
        this._logger,
        error
      );
    };
  };

  async getWords(getWordArgs: GetWordArgs) {
    const query = this._wordRepository
      .createQueryBuilder('word')
      .select()
      .orderBy('word.text', 'ASC'); //TODO handle business filter at here
    return pagination.offset.paginate(query, getWordArgs);
  };

  async setWordPos(setWordPosInput: SetWordPosInput) {
    const {wordId, posId} = setWordPosInput;
    const word = await this._connection.getRepository(Word).findOne(wordId);

    if(!word) throw new exceptions.NotFoundError('Not found', this._logger);
    const pos = await this._connection.getRepository(Pos).findOne(posId);

    if(!pos) throw new exceptions.NotFoundError('Not found', this._logger);
    try {
      const meaning = this._meaningRepository.create();
      meaning.pos = pos;
      meaning.word = word;
      return await this._meaningRepository.save(meaning);
    } catch(error) {
      throw new exceptions.InternalServerError(
        'Internal server',
        this._logger,
        error
      );
    };
  };

  async findOne(findWordArgs: FindWordArgs) {
    const word = await this._wordRepository.findOne({
      where: {
        text: findWordArgs.search
      }
    });
    if(!word){
      return null;
    };
    return word;
  };

  async addPhrase(addPhraseInput: AddPhraseInput) {
    const word = await this._wordRepository.findOne(addPhraseInput.wordId);
    if(!word) throw new exceptions.NotFoundError('not found word', this._logger);

    const phrase = await this._connection
      .createQueryBuilder(Phrase, 'phrase')
      .where('phrase.id = :phraseId', {phraseId: addPhraseInput.phraseId})
      .getOne();
    if(!phrase) throw new exceptions.NotFoundError('not found phrase', this._logger);

    const contain = this._containRepository.create();
    contain.phrase = phrase;
    contain.word = word;
    await this._containRepository.save(contain);
    return word;
  };

  async findMeaningByWordId(wordId: string) {
    const meaning = await this._connection
      .getRepository(Meaning)
      .createQueryBuilder('meaning')
      .where('meaning.wordId = :wordId', {wordId})
      .getMany();
    return meaning;
  };

  async findContainByWordId(wordId: string) {
    const contain = await this._containRepository
      .createQueryBuilder('contain')
      .leftJoinAndSelect('contain.word', 'word')
      .where('word.id = :wordId', {wordId})
      .getMany();
    return contain;
  };

  async findLangByWordId(wordId: string) {
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

    if(!lang) throw new exceptions.NotFoundError('Not found', this._logger);
    return lang;
  };

  async findWordFederation(wordId: string) {
    if (!wordId) return null;
    const word = await this._wordRepository.findOne(wordId);
    return word;
  };
};
