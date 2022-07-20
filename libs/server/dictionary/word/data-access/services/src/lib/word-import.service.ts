/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Concept } from '@els/server/dictionary/concept/data-access/entities';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Detail } from '@els/server/dictionary/detail/data-access/entities';
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { Join } from '@els/server/dictionary/join/data-access/entities';
import { Lang } from '@els/server/dictionary/lang/data-access/entities';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { Pos } from '@els/server/dictionary/pos/data-access/entities';
import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { Term } from '@els/server/dictionary/term/data-access/entities';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { BaseLang, exceptions, MinIoService, nlpTranslation } from '@els/server/shared';
import { HttpService, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, QueryRunner, Repository } from 'typeorm';
import * as XLSX from 'xlsx';

@Injectable()
export class WordImportService {
  private readonly _logger = new Logger(WordImportService.name);

  constructor(
    @InjectRepository(Word)
    private readonly _wordRepository: Repository<Word>,
    @InjectRepository(Meaning)
    private readonly _meaningRepository: Repository<Meaning>,
    @InjectRepository(Definition)
    private readonly _definitionRepository: Repository<Definition>,
    @InjectRepository(Pronunciation)
    private readonly _pronunciationRepository: Repository<Pronunciation>,
    private readonly _connection: Connection,
    private readonly _httpService: HttpService,
    private readonly _minIoService: MinIoService,
  ) {};

  //* Tạo term
  private async _createTerm(example: Example, queryRunner: QueryRunner) {
    const words = example.sentence.split(' ');

    const listWordChecked:string[] = [];
    for(let i = 0; i < words.length; i++) {
      const word = words[i];

      if(!listWordChecked.includes(word)){
        const wordExisted = await queryRunner.manager
          .createQueryBuilder(Word, 'word')
          .where('word.text = :word', {word})
          .getOne();
        // const wordExisted = await this._wordRepository.findOne({
        //   where: {
        //     text: word
        //   }
        // });

        if(wordExisted) {
          const term = queryRunner.manager.create(Term);
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
          const phrase = await queryRunner.manager
            .createQueryBuilder(Phrase, 'phrase')
            .where('phrase.text = :phrase_2', {phrase_2})
            .getOne();
          // const phrase = await this._phraseRepository.findOne({
          //   where: {
          //     text: phrase_2
          //   }
          // });

          if(phrase) {
            const term = queryRunner.manager.create(Term);
            term.term = phrase_2;
            term.example = example;
            term.phraseId = phrase.id;
            await queryRunner.manager.save(term);
          };
          listWordChecked.push(phrase_2);
        };
      };
    };
  };

  private _checkDuplicateWord(wordExisted: any[], data: any, extractedData: any[], i: number) {
    return wordExisted.filter((item) => {
      if(data['wordEn'].trim()) {
        if(item['wordVn'].trim() === data['wordVn'].trim() && item['definitionEn'].toLowerCase().trim() === data['definitionEn'].toLowerCase().trim()){
          return true;
        } else {
          return false;
        }
      } else {
        if(item['wordVn'].trim() === data['wordVn'].trim() && item['definitionEn'].toLowerCase().trim() === extractedData[i - 1]['definitionEn'].toLowerCase().trim()){
          return true;
        } else {
          return false;
        }
      }
    });
  }

  //* validate file en to vn
  async validateFile(fileBuffer: Buffer) {
    //*lay du lieu tu file upload
    const workbook = XLSX.read(fileBuffer, {
      type: 'buffer',
      cellDates: true,
    });

    const ws = workbook.Sheets[workbook.SheetNames[0]];
    const extractedData: any[] = XLSX.utils.sheet_to_json(ws, {
      defval: '',
      header: [
        'wordEn',
        'synonymsEn',
        'wordType',
        'exampleEn',
        'definitionEn',
        'wordVn',
        'explanationVn',
        'exampleVn'
      ],
      raw: false
    });

    const validateData = [];
    const wordExisted: any[] = [];
    for(let i = 1; i < extractedData.length; i ++) {
      const data = extractedData[i];
      if(!data['wordVn']) {
        validateData.push(data);
        continue;
      }

      //* Kiem tra word duplicate
      const dataFilter = this._checkDuplicateWord(wordExisted, data, extractedData, i);

      if(dataFilter.length > 0) throw new  exceptions.ConflictError(`Word ${i + 1} duplicate !!`, this._logger);
      wordExisted.push({
        wordVn: data['wordVn'].trim(),
        definitionEn: data['definitionEn'] ? data['definitionEn'].toLowerCase().trim() : extractedData[i - 1]['definitionEn'].toLowerCase().trim()
      });

      //*Cat Example thanh list qua "/n"
      const listExample = data['exampleVn'].split('\n');
      data['exampleVn'] = listExample;
      const pos = await this._connection
        .createQueryBuilder(Pos, 'pos')
        .where('pos.name = :name', {
          name: data['wordType'] ? data['wordType'].trim() : extractedData[i - 1]['wordType'].trim()
        })
        .getOne();

      if(!pos) throw new exceptions.NotFoundError(`Not found word type ${i + 1}`, this._logger);
      data['wordType'] = pos.name;
        
      //*Kiem tra definition
      const definition = await this._definitionRepository
        .createQueryBuilder('definition')
        .where('LOWER(definition.description) = LOWER(:definitionEn)', {
          definitionEn: data['definitionEn'] ? data['definitionEn'] : extractedData[i - 1]['definitionEn']
        })
        .getOne();

      if(!definition) throw new exceptions.NotFoundError(`Not found definition ${i + 1}`, this._logger);
      data['definitionEn'] = definition.description?.toLowerCase().trim();
      data['explanationVn'] = data['explanationVn'].toLowerCase().trim();

      validateData.push(data);
    };
    console.log('Validate success !!');
    return validateData;
  };

  //* Xu ly voi word chua ton tai (Import en to vn)
  private async _handleWordNotExistedImportEnToVn(
    lang: Lang, 
    wordVn: string, 
    pos: Pos, 
    explanationVn: string,
    definitionEn: string,
    exampleVn: any,
    queryRunner: QueryRunner 
  ) {
    const word = this._wordRepository.create();
    word.lang = lang;
    word.text = wordVn;
    await queryRunner.manager.save(word);

    const meaning = this._meaningRepository.create();
    meaning.pos = pos;
    meaning.word = word;
    await queryRunner.manager.save(meaning);

    const definition = this._definitionRepository.create();
    definition.meaning = meaning;
    definition.explanation = explanationVn;
    definition.description = definitionEn;
    await queryRunner.manager.save(definition);

    //* Them example
    for(let j = 0; j < exampleVn.length; j++) {
      const example = queryRunner.manager.create(Example);
      example.sentence = exampleVn[j];
      example.definition = definition;
      example.token = wordVn;
      await queryRunner.manager.save(example);
      await this._createTerm(example, queryRunner);
    };

    //* Logic có thể bị thừa
    const conceptExisted =  await this._wordRepository
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.lang', 'lang')
      .leftJoinAndSelect('word.meanings', 'meanings')
      .leftJoinAndSelect('meanings.pos', 'pos')
      .leftJoinAndSelect('meanings.definitions', 'definitions')
      .leftJoinAndSelect('definitions.joins', 'joins')
      .leftJoinAndSelect('joins.concept', 'concept')
      .where('LOWER(definitions.description) = :description', {description: definitionEn})
      .andWhere('word.text != :text', {text: wordVn})
      .getOne();
              
    if(conceptExisted) { //* Handle concept da ton tai
      const conceptApply = conceptExisted.meanings.filter(item => {
        if(item.pos?.name === pos.name){
          return true;
        };
        return false;
      });

      if(conceptApply.length > 0){
        let definitionIndex = 0;
        conceptApply[0].definitions.forEach((item, indexConcept) => {
          if(item.description === definitionEn) {
            definitionIndex = indexConcept;
          };
        });

        const join = queryRunner.manager.create(Join);
        join.definition = definition;
        join.concept = conceptApply[0].definitions[definitionIndex].joins[0].concept;
        await queryRunner.manager.save(join);
        return word;
      }
      return word;
    };
    throw new exceptions.NotFoundError(`Not found definition ${definitionEn}`, this._logger);
  }

  //* Kiem tra tu da ton tai chua (Import en to vn)
  private _handleWordExistedInImportEnToVn(posExisted: Meaning[], definitionEn: string ){
    
    return  posExisted.filter(item => {
      const existed = item.definitions.filter(element => {
        if(element.description?.toLowerCase().trim() === definitionEn) {
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
  //* Xu ly tu, loai tu, dinh nghia da ton tai (Import en to vn)
  private async _handleWordTypeDefinitionExistedInImportEnToVn(
    wordType: string,
    definitionEn: string,
    wordExisted: Word,
    explanationVn: string,
    exampleVn: any[],
    wordVn: string,
    queryRunner: QueryRunner
  ) {
    //* Handle overwrite explanation hoặc example của từ
    const definitionExisted = await queryRunner.manager
      .createQueryBuilder(Definition, 'definition')
      .leftJoinAndSelect('definition.meaning', 'meaning')
      .leftJoinAndSelect('meaning.pos', 'pos')
      .leftJoinAndSelect('meaning.word', 'word')
      .where('definition.description = :description', {description: definitionEn})
      .andWhere('pos.name = :wordType', {wordType})
      .andWhere('word.id = :wordId', {wordId: wordExisted.id})
      .getOne();

    if(!definitionExisted) throw new exceptions.NotFoundError('Not found definition exited', this._logger);

    definitionExisted.explanation = explanationVn;
    await queryRunner.manager.save(definitionExisted);

    for(let j = 0; j < exampleVn.length; j++) {
      const exampleExisted = await queryRunner.manager
        .createQueryBuilder(Example, 'example')
        .leftJoinAndSelect('example.definition', 'definition')
        .where('LOWER(example.sentence) = LOWER(:sentence)', {sentence: exampleVn[j]})
        .andWhere('definition.id = :definitionId', {definitionId: definitionExisted.id})
        .getOne();

      if(!exampleExisted) {
        const example = queryRunner.manager.create(Example);
        example.sentence = exampleVn[j];
        example.definition = definitionExisted;
        example.token = wordVn;
        await queryRunner.manager.save(example);
        await this._createTerm(example, queryRunner);
      }
    };
  }

  //* Xu ly tu, loai tu ton tai, dinh nghia chua ton tai (Import en to vn)
  private async _handleDefinitionNotExistedInImportEnToVn(
    definitionEn: string,
    posExisted: Meaning[],
    explanationVn: string,
    exampleVn: any[],
    wordVn: string,
    queryRunner: QueryRunner
  ) {
    const definitionExisted = await queryRunner.manager
      .createQueryBuilder(Definition, 'definition')
      .leftJoinAndSelect('definition.joins', 'joins')
      .leftJoinAndSelect('joins.concept', 'concept')
      .where('definition.description = :description', {description: definitionEn})
      .getOne();

    if(!definitionExisted) throw new exceptions.NotFoundError(`Not found definition ${definitionEn}`, this._logger);

    //* Tạo definition với explanation tiếng việt
    const definition = this._definitionRepository.create();
    definition.meaning = posExisted[0];
    definition.description = definitionEn;
    definition.explanation = explanationVn;
    await queryRunner.manager.save(definition);

    for(let j = 0; j < exampleVn.length; j++) {
      const example = queryRunner.manager.create(Example);
      example.sentence = exampleVn[j];
      example.definition = definition;
      example.token = wordVn;
      await queryRunner.manager.save(example);
      await this._createTerm(example, queryRunner);
    };

    const join = queryRunner.manager.create(Join);
    join.definition = definition;
    join.concept = definitionExisted.joins[0].concept;
    await queryRunner.manager.save(join);
  }

  //* Xu ly concept da ton tai(Import en to vn)
  private async _handleConceptExistedInImportEnToVn(
    conceptExisted: Word, 
    pos: Pos, 
    definition: Definition, 
    definitionEn: string, 
    queryRunner: QueryRunner 
  ){
    const conceptApplies = conceptExisted.meanings.filter(item => {
      if(item.pos?.name === pos.name){
        return true;
      }
      return false;
    });

    if(conceptApplies.length > 0){
      let definitionIndex = 0;
      conceptApplies[0].definitions.forEach((item, index) => {
        if(item.description === definitionEn) {
          definitionIndex = index;
        };
      });

      const join = queryRunner.manager.create(Join);
      join.definition = definition;
      join.concept = conceptApplies[0].definitions[definitionIndex].joins[0].concept;
      await queryRunner.manager.save(join);
    };
  }

  //* Xu ly voi word da ton tai (Import en to vn)
  private async _handleWordExistedImportEnToVn(
    wordExisted: Word,
    wordType: string, 
    wordVn: string, 
    pos: Pos, 
    explanationVn: string,
    definitionEn: string,
    exampleVn: any,
    queryRunner: QueryRunner 
  ) {
    //*kiểm tra loại từ
    const posExisted = wordExisted.meanings.filter(item => {
      if(item.pos?.name === wordType){
        return true;
      }
      return false;
    });

    if(posExisted.length > 0) { //*Từ và loại từ đã tồn tại
      //* Kiểm tra definition của từ đã tồn tại chưa
      const descriptionExisted =  this._handleWordExistedInImportEnToVn(posExisted, definitionEn);

      if(descriptionExisted.length > 0){ //* Tu, loai tu, dinh nghia da ton tai
        await this._handleWordTypeDefinitionExistedInImportEnToVn(wordType, definitionEn, wordExisted, explanationVn, exampleVn, wordVn, queryRunner);
        return;
      };
      //* Tu, loai tu ton tai, dinh nghia chua ton tai
      await this._handleDefinitionNotExistedInImportEnToVn(definitionEn, posExisted, explanationVn, exampleVn, wordVn, queryRunner);
      return;
    } else { //*Tu va Loại từ chưa tồn tại
      const meaning = this._meaningRepository.create();
      meaning.pos = pos;
      meaning.word = wordExisted;
      await queryRunner.manager.save(meaning);

      const definition = this._definitionRepository.create();
      definition.meaning = meaning;
      definition.explanation = explanationVn;
      definition.description = definitionEn;
      await queryRunner.manager.save(definition);

      for(let j = 0; j < exampleVn.length; j++) {
        const example = queryRunner.manager.create(Example);
        example.sentence = exampleVn[j];
        example.definition = definition;
        example.token = wordVn;
        await queryRunner.manager.save(example);
        await this._createTerm(example, queryRunner);
      };

      const conceptExisted =  await this._wordRepository
        .createQueryBuilder('word')
        .leftJoinAndSelect('word.lang', 'lang')
        .leftJoinAndSelect('word.meanings', 'meanings')
        .leftJoinAndSelect('meanings.pos', 'pos')
        .leftJoinAndSelect('meanings.definitions', 'definitions')
        .leftJoinAndSelect('definitions.joins', 'joins')
        .leftJoinAndSelect('joins.concept', 'concept')
        .where('definitions.description = :description', {description: definitionEn})
        .andWhere('word.text != :text', {text: wordVn})
        .getOne();

      if(conceptExisted){
        await this._handleConceptExistedInImportEnToVn(conceptExisted, pos, definition, definitionEn, queryRunner);
        return ;
      }
      return;
    };
  }

  //* import file en to vn
  async importWordFromExcel(createWordByExcelInput: any[]) {
    //* Transaction
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let newWord = new Word();
      //* Bien tra ve de kiem tra co import thanh cong hay khong
      for( let index = 0; index < createWordByExcelInput.length; index++ ) {
        const createNewWordInput = createWordByExcelInput[index];
        const {wordType, exampleVn } = createNewWordInput;
        const definitionEn = createNewWordInput.definitionEn.toLowerCase().trim();
        const wordVn = createNewWordInput.wordVn.toLowerCase().trim();
        if(!wordVn) continue;
        let explanationVn = '';
        explanationVn = createNewWordInput.explanationVn.toLowerCase().trim();
        if(!createNewWordInput.explanationVn.toLowerCase().trim()) {
          // explanationVn = await this._connectTranslateApi(definitionEn, 'en', 'vi');
          explanationVn = await nlpTranslation(this._httpService, definitionEn, 'en', 'vi');
        }

        const lang = await queryRunner.manager
          .createQueryBuilder(BaseLang, 'lang')
          .where('lang.code = :langId', {langId: 'vi'})
          .getOne() as Lang;

        if (!lang) throw new exceptions.NotFoundError('Not found', this._logger);

        //*Kiem tra loai tu
        const pos = await queryRunner.manager
          .createQueryBuilder(Pos, 'pos')
          .where('pos.name = :name', {name: wordType})
          .getOne();
       
        if (!pos) throw new exceptions.NotFoundError('Not found', this._logger);

        //*Kiểm tra từ đã tồn tại chưa
        const wordExisted = await queryRunner.manager
          .createQueryBuilder(Word, 'word')
          .leftJoinAndSelect('word.lang', 'lang')
          .leftJoinAndSelect('word.meanings', 'meanings')
          .leftJoinAndSelect('meanings.pos', 'pos')
          .leftJoinAndSelect('meanings.definitions', 'definitions')
          .where('word.text = :text', {text: wordVn})
          .andWhere('lang.id = :langId', {langId: lang.id})
          .getOne();

        try {
          if(!wordExisted) { //* Xu ly voi word chua ton tai
            newWord = await this._handleWordNotExistedImportEnToVn(lang, wordVn, pos, explanationVn, definitionEn, exampleVn, queryRunner);
          } else { //* Xu ly voi word da ton tai
            await this._handleWordExistedImportEnToVn(wordExisted, wordType, wordVn, pos, explanationVn, definitionEn, exampleVn, queryRunner);
            newWord = wordExisted;
          };
        } catch(error) {
          throw new exceptions.InternalServerError(
            'Internal server',
            this._logger,
            error
          );
        };
      };
      await queryRunner.commitTransaction();
      return newWord;
    } catch(err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    };
    return [];
  };

  //* Get data from file Upload
  private async _handleFileWordEn(fileBuffer: any) {
    //*lay du lieu tu file upload
    const workbook = XLSX.read(fileBuffer, {
      type: 'buffer',
      cellDates: true,
    });
    const ws = workbook.Sheets[workbook.SheetNames[0]];
    const extractedData: any[] = XLSX.utils.sheet_to_json(ws, {
      defval: '',
      header: [
        'wordEn',
      ],
      raw: false
    });
    return extractedData;
  };

  //* Xử lý phần detail
  private async _detectWordDetail(result: any) {
    const listDetails = [
      'antonyms',
      'typeOf',
      'hasTypes',
      'partOf',
      'hasParts',
      'instanceOf',
      'hasInstances',
      'similarTo',
      'also',
      'entails',
      'memberOf',
      'hasMembers',
      'substanceOf',
      'hasSubstances',
      'inCategory',
      'hasCategories',
      'usageOf',
      'hasUsages',
      'inRegion',
      'regionOf',
      'pertainsTo',
    ];
    const detail: any = this._connection.manager.create(Detail);
      
    let hasDetail = false;

    //* Kiểm tra và lưu các giá trị mà word api trả về

    listDetails.forEach(item => {
      if(result[item]) {
        detail[item] = result[item];
        hasDetail = true;
      };
    });

    if(hasDetail) {
      await this._connection.manager.save(detail);
      return detail;
    } else {
      return null;
    };
  };

  //* Handle pronunciation in Import word EN
  private async _handlePronunciationInImportWordEN(text: string, pronunciationApi: any, partOfSpeech: any, pronunciation: Pronunciation, queryRunner: QueryRunner ) {
    if(pronunciationApi) {
      if(pronunciationApi[partOfSpeech]){
        pronunciation.phonetic = pronunciationApi[partOfSpeech];
      } else {
        if(pronunciationApi.all) {
          pronunciation.phonetic = pronunciationApi.all;
        } else {
          pronunciation.phonetic = pronunciationApi;
        };
      }

      await queryRunner.manager.save(pronunciation);
      // await this._pronunciationRepository.save(pronunciation);
    } else {
      console.log(`Pronunciation of ${text} not found`);
      pronunciation.phonetic = 'not found';
      await queryRunner.manager.save(pronunciation);
      // await this._pronunciationRepository.save(pronunciation);
    };
  }

  //* Handle example in import word EN
  private async _handleExampleInImportWordEN(exampleApi: any[], definition: Definition, text: string, queryRunner: QueryRunner) {
    for(let i = 0; i < exampleApi.length; i++) {
      const example = queryRunner.manager.create(Example);
      example.sentence = exampleApi[i];
      example.definition = definition;
      example.token = text;
      await queryRunner.manager.save(example);

      // await this._exampleService.connectTranslateApi(example);
      await this._createTerm(example, queryRunner);
    };
  }

  //* Handle concept existed in import word EN
  private async _handleConceptInImportWordEN(text: string, definitionApi: string, definition: Definition, queryRunner: QueryRunner, pos?: Pos ) {
    const join = queryRunner.manager.create(Join);
    //* Kiểm tra concept tồn tại
    const conceptExisted =  await queryRunner.manager
      .createQueryBuilder(Word, 'word')
      .leftJoinAndSelect('word.lang', 'lang')
      .leftJoinAndSelect('word.meanings', 'meanings')
      .leftJoinAndSelect('meanings.pos', 'pos')
      .leftJoinAndSelect('meanings.definitions', 'definitions')
      .leftJoinAndSelect('definitions.joins', 'joins')
      .leftJoinAndSelect('joins.concept', 'concept')
      .where('definitions.description = :description', {description: definitionApi})
      .andWhere('word.text != :text', {text})
      .getOne();

    if(!conceptExisted) { //* Concept không tồn tại
      const concept = queryRunner.manager.create(Concept);
      await queryRunner.manager.save(concept);

      join.definition = definition;
      join.concept = concept;
      await queryRunner.manager.save(join);

      // await this._detectAntonyms(results[j], text, pos.name, join.concept );
      return;
      // continue;
    }
    //* Concept tồn tại
    //*Kiểm tra đúng ngôn ngữ không
    const conceptApply = conceptExisted.meanings.filter(item => {
      if(item.pos?.name === pos?.name){
        return true;
      };
      return false;
    });

    if(conceptApply.length === 0){
      return;
      // continue;
    }
    //* Đúng ngôn ngữ
    let definitionIndex = 0;
    conceptApply[0].definitions.forEach((item, index) => {
      if(item.description === definitionApi) {
        definitionIndex = index;
      };
    });

    join.definition = definition;
    join.concept = conceptApply[0].definitions[definitionIndex].joins[0].concept;
    await queryRunner.manager.save(join);
  }

  //*Handle word not exited in Import word EN
  private async _handleWordNotExitedInImportWordEN(lang: Lang, text: string, results: any, pronunciationApi: any, queryRunner: QueryRunner ){
    const newWord = this._wordRepository.create();
    newWord.lang = lang;
    newWord.text = text;

    //* Nếu word API trả về results rỗng
    if(!results){
      console.log('Word has results empty: ' + text);
      return;
      // continue;
    };
    await queryRunner.manager.save(newWord);

    for(let j = 0; j < results.length; j++){
      const {partOfSpeech} = results[j];
      const definitionApi = results[j].definition;
      let exampleApi = [];
      if(results[j].examples) {
        exampleApi = results[j].examples;
      };

      let pos = await queryRunner.manager
        .createQueryBuilder(Pos, 'pos')
        .where('pos.name = :name', {name: partOfSpeech})
        .getOne();

      //* Xu ly pos khong ton tai
      if (!pos){
        console.log(`Type of ${text}: ${partOfSpeech}`);
        if(partOfSpeech){
          continue;
        }
        //* Truong hop partOfSpeech = null
        pos = await queryRunner.manager
          .createQueryBuilder(Pos, 'pos')
          .where('pos.name = :name', {name: 'null'})
          .getOne();
      };
      let meaning: Meaning;
      const meaningExisted = await queryRunner.manager
        .createQueryBuilder(Meaning, 'meaning')
        .leftJoinAndSelect('meaning.pos', 'pos')
        .leftJoinAndSelect('meaning.word', 'word')
        .where('pos.id = :posId', {posId: pos?.id})
        .andWhere('word.id = :wordId', {wordId: newWord?.id})
        .getOne();

      if(meaningExisted){
        meaning = meaningExisted;
      } else {
        meaning = this._meaningRepository.create();
        meaning.pos = pos;
        meaning.word = newWord;
        await queryRunner.manager.save(meaning);
      }

      const pronunciation = this._pronunciationRepository.create();

      //* Handle pronunciation
      await this._handlePronunciationInImportWordEN(text, pronunciationApi, partOfSpeech, pronunciation, queryRunner);

      const detail = await this._detectWordDetail(results[j]);

      const definition = this._definitionRepository.create();
      definition.meaning = meaning;
      definition.pronunciation = pronunciation;
      definition.explanation = definitionApi;
      definition.description = definitionApi;
      definition.detail = detail;
      await queryRunner.manager.save(definition);

      //* Xu ly example
      await this._handleExampleInImportWordEN(exampleApi, definition, text, queryRunner);

      //* Xu ly Concept
      await this._handleConceptInImportWordEN(text, definitionApi, definition, queryRunner, pos);

    };
  }

  //* check conflict word in Import word EN
  private _checkConflictWordInImportWordEN(posExisted: Meaning[], definitionApi: string ) {
    return posExisted.filter(item => {
      const existed = item.definitions.filter(element => {
        if(element.description === definitionApi) {
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

  //* Handle pos existed in Import word EN
  private async _handlePosExistedInImportWordEN(
    posExisted: Meaning[], 
    definitionApi: string, 
    text: string, 
    pronunciationApi: any, 
    partOfSpeech: any,
    exampleApi: any[],
    queryRunner: QueryRunner  
  ) {
    const descriptionExisted = this._checkConflictWordInImportWordEN(posExisted, definitionApi);

    if(descriptionExisted.length > 0){
      console.log(`----------Word ${text} conflict ----------`);
      return;
      // continue;
    }

    const pronunciation = this._pronunciationRepository.create();
    const definition = this._definitionRepository.create();
    const join = queryRunner.manager.create(Join);

    const definitionExisted = await queryRunner.manager
      .createQueryBuilder(Definition, 'definition')
      .leftJoinAndSelect('definition.joins', 'joins')
      .leftJoinAndSelect('joins.concept', 'concept')
      .where('definition.description = :description', {definitionApi})
      .getOne();

    if(!definitionExisted){ //* Definition chua ton tai

      await this._handlePronunciationInImportWordEN(text, pronunciationApi, partOfSpeech, pronunciation, queryRunner);

      definition.meaning = posExisted[0];
      definition.pronunciation = pronunciation;
      definition.explanation = definitionApi;
      definition.description = definitionApi;
      await queryRunner.manager.save(definition);

      await this._handleExampleInImportWordEN(exampleApi, definition, text, queryRunner);

      const concept = queryRunner.manager.create(Concept);
      await queryRunner.manager.save(concept);

      join.definition = definition;
      join.concept = concept;
      await queryRunner.manager.save(join);
      return;

    }
    //* Definition da ton tai

    await this._handlePronunciationInImportWordEN(text, pronunciationApi, partOfSpeech, pronunciation, queryRunner);

    definition.meaning = posExisted[0];
    definition.pronunciation = pronunciation;
    definition.explanation = definitionApi;
    definition.description = definitionApi;
    await queryRunner.manager.save(definition);

    await this._handleExampleInImportWordEN(exampleApi, definition, text, queryRunner);

    join.definition = definition;
    join.concept = definitionExisted.joins[0].concept;
    await queryRunner.manager.save(join);
  }

  //* Handle pos not existed in Import word EN
  private async _handlePosNotExistedInImportWordEN(
    wordExisted: Word, 
    definitionApi: string, 
    text: string, 
    pronunciationApi: any, 
    partOfSpeech: any,
    exampleApi: any[],
    queryRunner: QueryRunner 
  ) {
    const pos = await queryRunner.manager
      .createQueryBuilder(Pos, 'pos')
      .where('pos.name = :name', {name: partOfSpeech})
      .getOne();

    if (!pos){
      console.log(`Not found ${text} -- ${partOfSpeech}`);
      // continue;
      return;
    };

    const meaning = this._meaningRepository.create();
    meaning.pos = pos;
    meaning.word = wordExisted;
    await queryRunner.manager.save(meaning);

    const pronunciation = this._pronunciationRepository.create();
    await this._handlePronunciationInImportWordEN(text, pronunciationApi, partOfSpeech, pronunciation, queryRunner);

    const definition = this._definitionRepository.create();
    definition.meaning = meaning;
    definition.pronunciation = pronunciation;
    definition.description = definitionApi;
    definition.explanation = definitionApi;
    await queryRunner.manager.save(definition);

    await this._handleExampleInImportWordEN(exampleApi, definition, text, queryRunner);

    const concept = queryRunner.manager.create(Concept);
    await queryRunner.manager.save(concept);

    const join = queryRunner.manager.create(Join);
    join.definition = definition;
    join.concept = concept;
    await queryRunner.manager.save(join);
  }

  //*Handle word exited in Import word EN
  private async _handleWordExitedInImportWordEN(wordExisted: Word, text: string, results: any, pronunciationApi: any, queryRunner: QueryRunner) {
    for(let j = 0; j < results.length; j++) {
      const {partOfSpeech} = results[j];
      const definitionApi = results[j].definition;
      let exampleApi = [];
      if(results[j].examples) {
        exampleApi = results[j].examples;
      };

      const posExisted = wordExisted.meanings.filter(item => {
        if(item.pos?.name === partOfSpeech){
          return true;
        }
        return false;
      });

      if(posExisted.length > 0) {
        await this._handlePosExistedInImportWordEN(posExisted, definitionApi, text, pronunciationApi, partOfSpeech, exampleApi, queryRunner);
      } else {
        await this._handlePosNotExistedInImportWordEN(wordExisted, definitionApi, text, pronunciationApi, partOfSpeech, exampleApi, queryRunner);
      };
    };
  };

  //* Import word EN
  async createWordsByApi(fileBuffer: Buffer): Promise<any> {
    //* Transaction
    const queryRunner = this._connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //* Get data from file Upload
      const extractedData = await this._handleFileWordEn(fileBuffer);
      for(let i = 0; i < extractedData.length; i++) {
        console.log(extractedData[i].wordEn);
        const word = extractedData[i].wordEn;

        //* Gọi word API để lấy data
        const result = await this._httpService.get(process.env.WORD_API_URL + word).toPromise();

        if(!result){ //* neu wordApi khong tra ve result
          console.log('WordApi did not found result of word ' + word);
          continue;
        };
        //* Neu wordApi co tra ve result
        const data = result.data;
        const {results} = data;
        const text = data.word;
        const pronunciationApi = data.pronunciation;

        const lang = await queryRunner.manager
          .createQueryBuilder(BaseLang, 'lang')
          .where('lang.code = :code', {code: 'en'})
          .getOne() as Lang;
        if (!lang) throw new exceptions.NotFoundError(`Not found ${text}`, this._logger);

        //* Kiểm tra word tồn tại
        const wordExisted = await queryRunner.manager
          .createQueryBuilder(Word, 'word')
          .leftJoinAndSelect('word.lang', 'lang')
          .leftJoinAndSelect('word.meanings', 'meanings')
          .leftJoinAndSelect('meanings.pos', 'pos')
          .leftJoinAndSelect('meanings.definitions', 'definitions')
          .where('word.text = :text', {text})
          .andWhere('lang.id = :langId', {langId: lang.id})
          .getOne();

        try {
          if(!wordExisted) { //* Nếu word chưa tồn tại
            await this._handleWordNotExitedInImportWordEN(lang, text, results, pronunciationApi, queryRunner);
          } else { //* Nếu word đã tồn tại
            await this._handleWordExitedInImportWordEN(wordExisted, text, results, pronunciationApi, queryRunner);
          };
        } catch(error) {
          throw new exceptions.InternalServerError(
            'Internal server',
            this._logger,
            error
          );
        };
      };
      await queryRunner.commitTransaction();
    } catch(err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  };

  //* Viết hoa chữ cái đầu
  private _capitalize = (s: any) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  
  //* Export file definition of word en
  async exportFormSample(fileBuffer: Buffer) {
    //*lay du lieu tu file upload
    const workbook = XLSX.read(fileBuffer, {
      type: 'buffer',
      cellDates: true,
    });

    const wsRead = workbook.Sheets[workbook.SheetNames[0]];
    const extractedData: any[] = XLSX.utils.sheet_to_json(wsRead, {
      defval: '',
      header: [
        'wordEn',
      ],
      raw: false
    });
    console.log(workbook.SheetNames[0]);
    const listWordEn = extractedData.map(item => {
      return item['wordEn'];
    });

    //* Lấy và sắp xếp các definition theo danh sách từ truyền vào
    const definitions = await this._definitionRepository
      .createQueryBuilder('definition')
      .leftJoinAndSelect('definition.meaning', 'meaning')
      .leftJoinAndSelect('meaning.pos', 'pos')
      .leftJoinAndSelect('meaning.word', 'word')
      .leftJoinAndSelect('word.lang', 'lang')
      .leftJoinAndSelect('definition.examples', 'examples')
      .leftJoinAndSelect('definition.joins', 'joins')
      .leftJoinAndSelect('joins.concept', 'concept')
      .where('lang.code = :code', {code: 'en'})
      .andWhere('word.text IN(:...texts)', {texts: listWordEn})
      .distinctOn(['definition.description'])
      .orderBy('definition.description')
      .getMany();

    const listRecord: any[] = [];

    //* Handle logic
    for(let i = 0; i < definitions.length; i++) {
      const definition = definitions[i];
      //*Kiểm tra xem definition có concept không
      if(!definition.joins[0]) {
        console.log(definition.id);
        continue;
      };

      if(!definition.description) throw new exceptions.NotFoundError('Not found description', this._logger);

      //* Dịch nghĩa defination và thềm vào cộ Định nghĩa tiếng viêtk
      const explanationVn = await nlpTranslation(this._httpService, definition.description, 'en', 'vi');

      //* Tìm các từ có chung concept
      const concept = definition.joins[0].concept;
      const words = await this._wordRepository
        .createQueryBuilder('word')
        .leftJoinAndSelect('word.lang', 'lang')
        .leftJoinAndSelect('word.meanings', 'meanings')
        .leftJoinAndSelect('meanings.definitions', 'definitions')
        .leftJoinAndSelect('definitions.joins', 'joins')
        .leftJoinAndSelect('joins.concept', 'concept')
        .where('concept.id = :conceptId', {conceptId: concept.id})
        .andWhere('lang.code = :code', {code: 'en'})
        .getMany();
      
      //* Tạo list từ dùng để lọc lấy từ đồng nghĩa trong ngôn ngữ "en"
      const listWords: any[] = [];
      words.forEach(item => {
        listWords.push(item.text);
      });

      for(let j = 0; j < words.length; j++) {
        const word = words[j];
        //* Tìm các definition theo từ và concept
        const wordDefinition = await this._definitionRepository
          .createQueryBuilder('definition')
          .leftJoinAndSelect('definition.examples', 'examples')
          .leftJoinAndSelect('definition.meaning', 'meaning')
          .leftJoinAndSelect('meaning.word', 'word')
          .leftJoinAndSelect('definition.joins', 'joins')
          .leftJoinAndSelect('joins.concept', 'concept')
          .where('concept.id = :conceptId', {conceptId: concept.id})
          .andWhere('word.id = :wordId', {wordId: word.id})
          .getOne();

        //* list từ đồng nghĩa trong ngôn ngữ "en"
        const newListWord = listWords.filter(item => item !== word.text);

        //* Lấy list ví dụ của từ
        const listExample: any[] = [];
        if(wordDefinition){
          wordDefinition.examples.forEach(item => {
            listExample.push(this._capitalize(item.sentence));
          });
        };

        const dataRecord = {
          wordEn: word.text,
          synonyms: newListWord.join(', '),
          wordType: definition.meaning.pos?.name,
          exampleEn: listExample.join('  \n'),
          definition: definition.description,
          wordVn: '',
          explanationVn: explanationVn,
        };
        listRecord.push(dataRecord);
      };
    };

    //* Thực hiện ghi vào file export
    //* Custom header name
    const Heading = [
      ['Word(EN)', 
        'Synonyms(EN)', 
        'Word Type(EN)',
        'Example(EN)',
        'Definition(EN)',
        'Word(VN)',
        'Explanation(VN)',
        'Example(VN)'
      ],
    ];

    const day = new Date().getDate();
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    //* Export file xlsx
    const wsWrite = XLSX.utils.json_to_sheet(listRecord);
    const wb = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(wsWrite, Heading);
    XLSX.utils.book_append_sheet(wb, wsWrite, 'words definition');
    const bufferWritten = XLSX.write(wb, {type: 'buffer', bookType: 'xlsx'});
    await this._minIoService.uploadFileDefinition(`${workbook.SheetNames[0]}_${day}-${month+1}-${year}_${hour}-${minute}.xlsx`, bufferWritten);
    return definitions;
  };
};