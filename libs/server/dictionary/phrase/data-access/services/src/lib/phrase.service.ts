/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Phrase } from 'libs/server/dictionary/common/src/lib/configs/entities-index';
import { Connection, QueryRunner, Repository } from 'typeorm';
import { CreatePhraseInput, TranslatePhrase } from '../../../type/src';
import { PhraseTranslation } from '@els/server/dictionary/phrase-translation/data-access/entities';
import { Lang } from '@els/server/dictionary/lang/data-access/entities';
import { BaseLang, exceptions } from '@els/server/shared';
import * as XLSX from 'xlsx';

@Injectable()
export class PhraseService {
  private readonly _logger = new Logger(PhraseService.name);

  constructor(
    @InjectRepository(Phrase)
    private readonly _phraseRepository: Repository<Phrase>,
    @InjectRepository(PhraseTranslation)
    private readonly _phraseTranslationRepository: Repository<PhraseTranslation>,
    private readonly _connection: Connection
  ) {};

  async createPhrase(createPhraseInput: CreatePhraseInput, queryRunnerArg?: QueryRunner) {
    let phraseExisted : any;
    if(queryRunnerArg){
      phraseExisted = await queryRunnerArg?.manager
        .createQueryBuilder(Phrase, 'phrase')
        .where('phrase.text = :phraseEn', {phraseEn: createPhraseInput.text})
        .getOne();
    } else {
      phraseExisted = await this._phraseRepository.manager
        .createQueryBuilder(Phrase, 'phrase')
        .where('phrase.text = :phraseEn', {phraseEn: createPhraseInput.text})
        .getOne();
    }
    if(phraseExisted){
      throw new exceptions.ConflictError(`Phrase ${createPhraseInput.text} existed`, this._logger);
    }
    
    const phrase = this._phraseRepository.create(createPhraseInput);
      
    if(queryRunnerArg){
      return await queryRunnerArg.manager.save(phrase);
    };

    return await this._phraseRepository.save(phrase);
  };

  async translatePhrase(translatePhrase: TranslatePhrase, queryRunnerArg?: QueryRunner) {
      
    //* Transaction
    let queryRunner = this._connection.createQueryRunner();
    if(queryRunnerArg) {
      queryRunner = queryRunnerArg;
    } else {
      await queryRunner.connect();
      await queryRunner.startTransaction();
    }

    try {
      const phrase = await queryRunner.manager
        .createQueryBuilder(Phrase, 'phrase')
        .where('phrase.id = :phraseId', {phraseId: translatePhrase.phraseId})
        .getOne();

      if(!phrase) throw new  exceptions.NotFoundError('Not found phrase', this._logger);

      const phraseTranslation = this._phraseTranslationRepository.create(translatePhrase);
      phraseTranslation.phrase = phrase;
      if(!queryRunnerArg) {
        await queryRunner.commitTransaction();
      };
      return phrase;
    } catch(err) {
      await queryRunner.rollbackTransaction();
    } finally {
      if(!queryRunnerArg) {
        await queryRunner.release();
      };
    }
    
  };

  async getPhrase() {
    return await this._phraseRepository.find();
  };

  async findByExampleId(exampleId: string) {
    const phrase = await this._phraseRepository
      .createQueryBuilder('phrase')
      .leftJoinAndSelect('phrase.examples', 'examples')
      .where('example.id = :exampleId', {exampleId})
      .getOne();
    return phrase;
  };

  //* Get data from file Upload
  private async _handleFilePhrase(fileBuffer: any) {
    //*lay du lieu tu file upload
    const workbook = XLSX.read(fileBuffer, {
      type: 'buffer',
      cellDates: true,
    });
      
    const ws = workbook.Sheets[workbook.SheetNames[0]];
    const extractedData: any[] = XLSX.utils.sheet_to_json(ws, {
      defval: '',
      header: [
        'phraseEn',
        'explanation',
        'phraseVn'
      ],
      raw: false
    });
    return extractedData;
  };

  //* Import file Phrase
  async importFilePhrase(fileBuffer: Buffer) {
    //* Transaction
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //* Get data from file Upload
      const extractedData = await this._handleFilePhrase(fileBuffer);
      const langExisted = await queryRunner.manager
        .createQueryBuilder(BaseLang, 'lang')
        .where('lang.code IN (:...code)', {code: ['en', 'vi']})
        .getMany();

      if(langExisted.length < 2) throw new exceptions.NotFoundError('Languages not found', this._logger);

      for(let i = 1; i < extractedData.length; i++) {
        const dataPhrase = extractedData[i];
        const dataCreatePhrase :CreatePhraseInput = {
          lang: 'en',
          explanation: dataPhrase.explanation,
          text: dataPhrase.phraseEn
        };

        const phrase = await this.createPhrase(dataCreatePhrase, queryRunner);

        const dataTranslatePhrase :TranslatePhrase = {
          lang: 'vi',
          phraseId: phrase.id,
          text: dataPhrase.phraseVn
        };

        await this.translatePhrase(dataTranslatePhrase, queryRunner);
      };

      await queryRunner.commitTransaction();
      return null;
    } catch(err) {
      console.log(err);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
  
  async findPhraseFederation(phraseId: string){
    const phrase = await this._phraseRepository.findOne(phraseId);
    return phrase;
  }
};
