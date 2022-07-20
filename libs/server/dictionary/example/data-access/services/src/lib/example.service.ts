/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { Term } from '@els/server/dictionary/term/data-access/entities';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { BaseLang, exceptions, nlpTranslation } from '@els/server/shared';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ExampleTranslation } from 'libs/server/dictionary/example-translation/data-access/entities/src';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { Definition } from '../../../../../definition/data-access/entities/src';
import { CreateExampleInput, TranslateExampleInput } from '../../../types/src';
import { Example } from '@els/server/dictionary/example/data-access/entities';
@Injectable()
export class ExampleService {
  private readonly _logger = new Logger(ExampleService.name);
  constructor(
    @InjectRepository(Example)
    private readonly _exampleRepository: Repository<Example>,
    @InjectRepository(Term)
    private readonly _termRepository: Repository<Term>,
    @InjectRepository(Word)
    private readonly _wordRepository: Repository<Word>,
    @InjectRepository(Phrase)
    private readonly _phraseRepository: Repository<Phrase>,
    @InjectRepository(ExampleTranslation)
    private readonly _exampleTranslationRepository: Repository<ExampleTranslation>,
    private readonly _httpService: HttpService,
    private readonly _connection: Connection
  ) {};

  private async _checkWordToCreateTerm(example: Example, words: string[], queryRunner: QueryRunner ) {
    const listWordChecked:string[] = [];
    for(let i = 0; i < words.length; i++) {
      const word = words[i];
  
      if(!listWordChecked.includes(word)){
        const wordExisted = await this._wordRepository.findOne({
          where: {
            text: word
          }
        });
  
        if(wordExisted) {
          const term = this._termRepository.create();
          term.term = word;
          term.example = example;
          term.wordId = wordExisted.id;
          await queryRunner.manager.save(term);
  
          listWordChecked.push(word);
        };
      };
  
      if(i+1 < words.length) {
        const phrase_2 = `${words[i]} ${words[i+1]}`;
  
        if(!listWordChecked.includes(phrase_2)) {
          const phrase = await this._phraseRepository.findOne({
            where: {
              text: phrase_2
            }
          });
              
          if(phrase) {
            const term = this._termRepository.create();
            term.term = phrase_2;
            term.example = example;
            term.phraseId = phrase.id;
            await queryRunner.manager.save(term);
          };
          listWordChecked.push(phrase_2);
        };
      };
    };
  }

  private async _createExampleDefinition(createExampleInput: CreateExampleInput, queryRunner: QueryRunner) {
    const definition = await this._connection
      .createQueryBuilder(Definition, 'definition')
      .leftJoinAndSelect('definition.meaning', 'meaning')
      .leftJoinAndSelect('meaning.word', 'word')
      .where('definition.id = :definitionId', {definitionId: createExampleInput.definitionId})
      .getOne();
  
    if(!definition) throw new exceptions.NotFoundError('Not found definition', this._logger);
    const example = this._exampleRepository.create(createExampleInput);
    example.definition = definition;
    example.token = definition.meaning.word.text;
    await queryRunner.manager.save(example);
        
    const words = createExampleInput.sentence.split(' ');
    await this._checkWordToCreateTerm(example, words, queryRunner);
    return example;
  }

  private async _createExamplePhrase(createExampleInput: CreateExampleInput, queryRunner: QueryRunner) {
    const phrase = await this._phraseRepository
      .createQueryBuilder('phrase')
      .where('phrase.id = :phraseId', {phraseId: createExampleInput.phraseId})
      .getOne();
  
    if(!phrase) throw new exceptions.NotFoundError('Not found phrase', this._logger);
    const example = this._exampleRepository.create(createExampleInput);
    example.phrase = phrase;
    example.token = phrase.text || '';
    await queryRunner.manager.save(example);
  
    const words = createExampleInput.sentence.split(' ');
    await this._checkWordToCreateTerm(example, words, queryRunner);
    return example;
  }

  //* Tạo Example
  async createExample(createExampleInput: CreateExampleInput) {
    //* Transaction
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if(createExampleInput.definitionId) {
        const example = await this._createExampleDefinition(createExampleInput, queryRunner);
        await queryRunner.commitTransaction();
        return example;
      };
  
      if(createExampleInput.phraseId) {
        const example = await this._createExamplePhrase(createExampleInput, queryRunner);
        await queryRunner.commitTransaction();
        return example;
      };
      return {};
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new exceptions.InternalServerError('Create example error !', this._logger, err);
    } finally {
      await queryRunner.release();
    };
  };

  //* Tìm term
  async findTermById(exampleId: string) {
    const terms = await this._termRepository
      .createQueryBuilder('term')
      .leftJoinAndSelect('term.example', 'example')
      .where('example.id = :exampleId', {exampleId})
      .getMany();
    return terms;
  };

  //* Tìm phrase
  async findPhraseById(exampleId: string) {
    const phrase = await this._phraseRepository
      .createQueryBuilder('phrase')
      .leftJoinAndSelect('phrase.examples', 'examples')
      .where('examples.id = :exampleId', {exampleId})
      .getOne();
    return phrase;
  };

  //* Tìm example translation by example Id
  async findExampleTranslationsById(exampleId: string) {
    const exampleTranslations = await this._exampleTranslationRepository
      .createQueryBuilder('exampleTranslation')
      .leftJoinAndSelect('exampleTranslation.example', 'example')
      .where('example.id = :exampleId', {exampleId})
      .getMany();
    return exampleTranslations;
  };

  //* Tìm example
  async findExample(sentence:string) {
    const example = await this._exampleRepository
      .createQueryBuilder('example')
      .where('example.sentence = :sentence', {sentence})
      .getOne();
    if(!example) throw new exceptions.NotFoundError(`Not found example ${sentence}`, this._logger);
    return example;
  };

  //* Timeout
  private async _timeOut(ms: number) {
    return new Promise(res => setTimeout(res, ms));
  };

  //* Hàm chính để kiểm tra và translate tất cả Example theo ngôn ngữ (from --> to)
  async translateExamples(translateExampleInput: TranslateExampleInput) {
    const {from, to} = translateExampleInput;

    //* Tìm ngôn ngữ from và to trong database
    const langFrom = await this._connection
      .createQueryBuilder(BaseLang, 'lang')
      .where('lang.code = :code', {code: from})
      .getOne();

    if(!langFrom) throw new exceptions.NotFoundError('Not found lang from', this._logger);

    const langTo = await this._connection
      .createQueryBuilder(BaseLang, 'lang')
      .where('lang.code = :code', {code: to})
      .getOne();

    if(!langTo) throw new exceptions.NotFoundError('Not found lang to', this._logger);

    //* Lấy các ví dụ có cùng ngôn ngữ "from" để giải nghĩa sang "to"
    const examples = await this._exampleRepository
      .createQueryBuilder('example')
      .leftJoinAndSelect('example.exampleTranslations', 'exampleTranslations')
      .leftJoinAndSelect('example.definition', 'definition')
      .leftJoinAndSelect('definition.meaning', 'meaning')
      .leftJoinAndSelect('meaning.word', 'word')
      .leftJoinAndSelect('word.lang', 'lang')
      .where('lang.code = :code', {code: from})
      .getMany();

    for(let i = 0; i < examples.length; i++ ) {
      const example = examples[i];

      //* Kiểm tra xem ví dụ đã được dịch trước đó chưa
      if(example.exampleTranslations.length > 0) { //* Ví dụ đã được dịch trước đó
        //* Kiểm tra ví dụ được dịch có cùng ngôn ngữ "to" không
        const exampleExisted = example.exampleTranslations.filter(item => {
          if(item.lang === to) {
            return true;
          };
          return false;
        });

        if(exampleExisted.length > 0) { //* Cùng ngôn ngữ "to"
          continue;
        } else { //* Khác ngôn ngữ "to"
          //* If dùng để test translate từ để không gọi quá nhiều translate API
          await this.connectTranslateApi(example, from, to);
        };
      } else { //* Ví dụ chưa được dịch trước đó
        //* If dùng để test translate từ để không gọi quá nhiều translate API
        await this.connectTranslateApi(example, from, to);
      };
    };
    return examples[0];
  }; 

  //* Translate example use NLP API 
  async connectTranslateApi(example: Example, from: string, to: string) {
    if(!example) throw new exceptions.NotFoundError('Not found Example', this._logger);
    //*Gọi translate NLP API
    const sentenceTranslated = await nlpTranslation(this._httpService, example.sentence.toLowerCase().trim(), from, to);

    //*Tạo Example translation
    // console.log(sentenceTranslated);
    const exampleTranslation = this._exampleTranslationRepository.create();
    exampleTranslation.text = sentenceTranslated;
    exampleTranslation.lang = to;
    exampleTranslation.example = example;
    await this._exampleTranslationRepository.save(exampleTranslation);
    return example;
  };
};
