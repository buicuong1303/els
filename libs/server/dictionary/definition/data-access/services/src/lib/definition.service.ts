import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { Concept } from '@els/server/dictionary/concept/data-access/entities';
import {
  JoinDefinitionConceptMeaningPronunciationWord,
} from '@els/server/dictionary/join/data-access/entities';
import { Connection, In, Repository } from 'typeorm';
import { FieldTb } from '@els/server/dictionary/field/data-access/entities';
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { exceptions } from '@els/server/shared';
import { AntonymsType } from '@els/server/dictionary/definition/data-access/types';
@Injectable()
export class DefinitionService {
  private readonly _logger = new Logger(DefinitionService.name);
  constructor(
    @InjectRepository(Word)
    private readonly _wordRepository: Repository<Word>,
    @InjectRepository(Definition)
    private readonly _definitionRepository: Repository<Definition>,
    @InjectRepository(Pronunciation)
    private readonly _pronunciationRepository: Repository<Pronunciation>,
    @InjectRepository(FieldTb)
    private readonly _fieldTbRepository: Repository<FieldTb>,
    @InjectRepository(Example)
    private readonly _exampleRepository: Repository<Example>,
    @InjectRepository(Concept)
    private readonly _conceptRepository: Repository<Concept>,
    private readonly _connection: Connection
  ) {}

  //* Từ đồng nghĩa cùng ngôn ngữ (source)
  async findSynonymsById(definitionId: string, source: string) {
    let words: Word[] = [];

    //* Tìm các concept chung với definition
    const joins = await this._connection.manager.query(`
      SELECT "id", "conceptId","definitionId", "wordId" FROM "join_definition_concept_meaning_pronunciation_word" WHERE "definitionId"=$1
      `, [definitionId]
    );

    const concepts = await this._connection
      .getRepository(Concept)
      .createQueryBuilder('concept')
      .leftJoinAndSelect('concept.joins', 'joins')
      .where('joins.id IN (:...joinIds)', { joinIds: [...joins].map(item => item.id) })
      .getMany();

    //* Tìm tất cả các Join có chung concept
    const conceptIds = concepts.map(item => item.id);
    const joinSynonyms = await this._connection.manager.find(JoinDefinitionConceptMeaningPronunciationWord,  {
      select: ['conceptId', 'definitionId', 'id', 'wordId'],
      where: {
        conceptId: In(conceptIds)
      }
    });
    //* Lấy ra từ vựng cùng ngôn ngữ source trong các join đã tìm, trừ từ đang search
    const wordIds = joinSynonyms.map(item => item.wordId);
    words = await this._connection
      .getRepository(Word)
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.lang', 'lang')
      .where('word.id IN (:...wordIds)', { wordIds })
      .andWhere('lang.code = :source', { source })
      .getMany();
    return words;
  }

  //* Lấy từ đồng nghĩa ở ngôn ngữ khác (target)
  async findTranslateById(definitionId: string, target: string) {
    let words: Word[] = [];
    const joins = await this._connection.manager.find(JoinDefinitionConceptMeaningPronunciationWord,  {
      select: ['conceptId', 'definitionId', 'id', 'wordId'],
      where: {
        definitionId
      }
    });
    const joinIds = joins.map((item) => item.id);
    const concepts = await this._connection
      .getRepository(Concept)
      .createQueryBuilder('concept')
      .leftJoinAndSelect('concept.joins', 'joins')
      .where('joins.id IN (:...joinIds)', { joinIds })
      .getMany();

    const conceptIds = concepts.map((item) => item.id);

    const joinSynonyms = await this._connection.manager.find(JoinDefinitionConceptMeaningPronunciationWord,  {
      select: ['conceptId', 'definitionId', 'id', 'wordId'],
      where: {
        conceptId: In(conceptIds)
      }
    });

    const wordIds = joinSynonyms.map((item) => item.wordId);
    words = await this._connection
      .getRepository(Word)
      .createQueryBuilder('word')
      .leftJoinAndSelect('word.lang', 'lang')
      .where('word.id IN (:...wordIds)', { wordIds })
      .andWhere('lang.code = :target', { target })
      .getMany();
    return words;
  }

  async findByMeaningId(meaningId: string) {
    const definitions = await this._definitionRepository
      .createQueryBuilder('definition')
      .leftJoinAndSelect('definition.meaning', 'meaning')
      .where('meaning.id = :meaningId', { meaningId })
      .getMany();

    return definitions;
  }

  //* Lấy pronunciation
  async findPronunciationById(definitionId: string) {
    const pronunciation = await this._pronunciationRepository
      .createQueryBuilder('pronunciation')
      .leftJoinAndSelect('pronunciation.definitions', 'definitions')
      .where('definitions.id = :definitionId', { definitionId })
      .getOne();
    return pronunciation;
  }

  //* Lấy Field
  async findFieldTbById(definitionId: string) {
    const fieldTb = await this._fieldTbRepository
      .createQueryBuilder('fieldTb')
      .leftJoinAndSelect('fieldTb.definitions', 'definitions')
      .where('definitions.id = :definitionId', { definitionId })
      .getOne();
    return fieldTb;
  }

  //* Lấy Examples
  async findExamplesById(definitionId: string) {
    const examples = await this._exampleRepository
      .createQueryBuilder('example')
      .leftJoinAndSelect('example.definition', 'definition')
      .where('definition.id = :definitionId', { definitionId })
      .getMany();
    return examples;
  }

  //* Lấy chi tiết của từ
  async findDetailById(definitionId: string) {
    const definition = await this._definitionRepository
      .createQueryBuilder('definition')
      .leftJoinAndSelect('definition.detail', 'detail')
      .where('definition.id = :definitionId', { definitionId })
      .getOne();
    return definition?.detail;
  }

  //* Lấy từ trái nghĩa (Logic phần này về từ trái nghĩa đã bỏ)
  async findAntonyms(definitionData: Definition) {
    const definitionAccept = await this._definitionRepository
      .createQueryBuilder('definition')
      .leftJoinAndSelect('definition.joins', 'joins')
      .leftJoinAndSelect('joins.concept', 'concept')
      .where('definition.id = :definitionId', {
        definitionId: definitionData.id,
      })
      .getOne();

    if (!definitionAccept) {
      throw new exceptions.NotFoundError('Not found', this._logger);
    }

    let concepts: Concept[] = [];
    for (let i = 0; i < definitionAccept.joins.length; i++) {
      const join = definitionAccept.joins[i];
      concepts = await this._conceptRepository
        .createQueryBuilder('concept')
        .where('concept.antonym = :conceptId', { conceptId: join.concept.id })
        .getMany();
    }

    let listWord: Word[] = [];
    let explanation = '';

    for (let i = 0; i < concepts.length; i++) {
      const concept = concepts[i];

      const definition = await this._definitionRepository
        .createQueryBuilder('definition')
        .leftJoinAndSelect('definition.joins', 'joins')
        .leftJoinAndSelect('joins.concept', 'concept')
        .where('concept.id = :conceptId', { conceptId: concept.id })
        .getOne();

      if (definition) {
        explanation = definition.explanation ? definition.explanation : '';
      }

      const words = await this._wordRepository
        .createQueryBuilder('word')
        .leftJoinAndSelect('word.meanings', 'meanings')
        .leftJoinAndSelect('meanings.definitions', 'definitions')
        .leftJoinAndSelect('definitions.joins', 'joins')
        .leftJoinAndSelect('joins.concept', 'concept')
        .where('concept.id = :conceptId', { conceptId: concept.id })
        .getMany();

      if (words.length > 0) {
        listWord = listWord.concat(words);
      }
    }

    const wordExisted: any[] = [];
    const listWordFilter = listWord.filter((item) => {
      if (!wordExisted.includes(item.text)) {
        wordExisted.push(item.text);
        return true;
      } else {
        return false;
      }
    });

    const antonymsType = new AntonymsType();
    antonymsType.explanation = explanation;
    antonymsType.words = listWordFilter;
    return antonymsType;
  }
}
