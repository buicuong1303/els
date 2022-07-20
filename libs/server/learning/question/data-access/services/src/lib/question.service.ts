/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import {
  Enrollment,
  LearningSkill,
  MemoryAnalysis,
  QuestionAction,
  QuestionType,
  ResourceCategory,
  Topic,
  User,
} from '@els/server/learning/common';
import {
  Prompt,
  Question,
} from '@els/server/learning/question/data-access/entities';
import {
  GetQuestionArgs,
  QuickTestArgs,
} from '@els/server/learning/question/data-access/types';
import {
  Resource,
  Vocabulary,
} from '@els/server/learning/vocabulary/data-access/entities';
import { exceptions } from '@els/server/shared';
import { RandomUtil, StringUtil, trycat } from '@els/shared/utils';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Connection,
  EntityManager,
  IsNull,
  Not,
  QueryRunner,
  Repository,
} from 'typeorm';
interface ExtraImageCard {
  uri: string | undefined;
  description: string;
}
export class QuestionService {
  private readonly _logger = new Logger(QuestionService.name);
  constructor(
    @InjectRepository(Question)
    private readonly _questionRepository: Repository<Question>,

    private readonly _connection: Connection
  ) {}
  private _typeChallengeFactory: any = {
    fill: async (
      resources: Resource[],
      infoTopic: Topic,
      vocabulary: Vocabulary,
      manager: EntityManager
    ) => {
      const videosOrAudios = resources.filter(
        (resource: Resource) =>
          resource.category === ResourceCategory.video ||
          (resource.category === ResourceCategory.audio &&
            resource.isWord === false)
      );
      if (videosOrAudios.length === 0) return;
      const videosOrAudiosLength = videosOrAudios.length;
      for (let index = 0; index < videosOrAudiosLength; index++) {
        const videoOrAudio = videosOrAudios[index];
        for (const action in QuestionAction) {
          if (Object.prototype.hasOwnProperty.call(QuestionAction, action)) {
            await this._actionFillChallengeFactory[action](
              vocabulary,
              infoTopic,
              videoOrAudio,
              manager
            );
          }
        }
      }
    },
    speak: async (
      resources: Resource[],
      infoTopic: Topic,
      vocabulary: Vocabulary,
      manager: EntityManager
    ) => {
      const [data, audioError] = await trycat(
        manager.findOne(Resource, {
          where: {
            vocabulary: vocabulary,
            category: ResourceCategory.audio,
            isWord: true,
          },
        })
      );
      if (audioError)
        throw new exceptions.InternalServerError(
          'can not get audio resource',
          this._logger,
          audioError
        );
      const audio: Resource = data as any;

      const prompt = this._connection.getRepository(Prompt).create();

      prompt.audio = audio?.uri || '';
      prompt.text = vocabulary.vocabulary;
      prompt.topic = infoTopic;
      const [promptData, error] = await trycat(manager.save(prompt));
      if (error)
        throw new exceptions.InternalServerError(
          'can not create prompt',
          this._logger,
          error
        );
      const createdPrompt: Prompt = promptData as any;

      const question = this._questionRepository.create();
      question.action = QuestionAction.speak;
      question.type = QuestionType.speak;
      question.choices = JSON.stringify([]);
      question.correctAnswer = vocabulary.vocabulary;
      question.targetLang = infoTopic.learningLang.code;
      question.sourceLang = infoTopic.learningLang.code;
      question.vocabulary = vocabulary;
      question.prompt = createdPrompt;
      question.equipments = ['microphone'];
      question.skills = [LearningSkill.speaking];
      question.level = 4;
      await manager.save(question);
    },
    translate: async (
      resources: Resource[],
      infoTopic: Topic,
      vocabulary: Vocabulary,
      manager: EntityManager
    ) => {
      const sentences = resources.filter(
        (resource: Resource) => resource.category === ResourceCategory.sentence
      );
      const images = resources.filter(
        (resource: Resource) => resource.category === ResourceCategory.image
      );
      const audio = resources.find(
        (resource: Resource) =>
          resource.category === ResourceCategory.audio &&
          resource.isWord === true
      );
      //* translate sentence
      if (sentences.length > 0) {
        await this._makeTranslateSentenceChallenges(
          infoTopic,
          vocabulary,
          sentences,
          manager
        );
      }
      // * translate word
      await this._makeTranslateWordChallenges(
        infoTopic,
        vocabulary,
        images,
        audio,
        manager
      );
    },
    short_input: async (
      resources: Resource[],
      infoTopic: Topic,
      vocabulary: Vocabulary,
      manager: EntityManager
    ) => {
      const [data, audioError] = await trycat(
        manager.findOne(Resource, {
          where: {
            vocabulary: vocabulary,
            category: ResourceCategory.audio,
            isWord: true,
          },
        })
      );
      if (audioError)
        throw new exceptions.InternalServerError(
          'can not get audio resource',
          this._logger,
          audioError
        );
      const audio: Resource = data as any;
      if (!audio) return;
      const prompt = this._connection.getRepository(Prompt).create();
      prompt.audio = audio?.uri || '';
      prompt.topic = infoTopic;
      const [promptData, error] = await trycat(manager.save(prompt));
      if (error)
        throw new exceptions.InternalServerError(
          'can not create prompt',
          this._logger,
          error
        );
      const createdPrompt: Prompt = promptData as any;

      const question = this._questionRepository.create();
      question.action = QuestionAction.write;
      question.type = QuestionType.short_input;
      question.choices = JSON.stringify([]);
      question.correctAnswer = vocabulary.vocabulary;
      question.targetLang = infoTopic.learningLang.code;
      question.sourceLang = infoTopic.learningLang.code;
      question.vocabulary = vocabulary;
      question.prompt = createdPrompt;
      question.equipments = ['headphone'];
      question.skills = [LearningSkill.listening, LearningSkill.writing];
      question.level = 3;
      await manager.save(question);
    },
  };

  private _actionTranslateWordChallengeFactory: any = {
    arrange: async (
      vocabulary: Vocabulary,
      infoTopic: Topic,
      images: Resource[],
      audio: Resource | undefined,
      manager: EntityManager
    ) => {
      const prompt = this._connection.getRepository(Prompt).create();
      prompt.text = vocabulary.vocabulary;
      prompt.image = images[0]?.uri;
      prompt.audio = audio?.uri;
      prompt.topic = infoTopic;
      const [data, error] = await trycat(manager.save(prompt));
      if (error)
        throw new exceptions.InternalServerError(
          'can not create prompt',
          this._logger,
          error
        );
      const createdPrompt: Prompt = data as any;
      const question = this._questionRepository.create();
      question.choices = JSON.stringify(
        StringUtil.tokenize(vocabulary.vocabulary)
      );

      question.action = QuestionAction.arrange;
      question.correctAnswer = vocabulary.vocabulary;
      question.skills = [LearningSkill.reading, LearningSkill.writing];
      question.sourceLang = infoTopic.learningLang.code;
      question.targetLang = infoTopic.learningLang.code;
      question.type = QuestionType.translate;
      question.vocabulary = vocabulary;
      question.prompt = createdPrompt;
      question.level = 2;

      await manager.save(question);
    },
    select: async (
      vocabulary: Vocabulary,
      infoTopic: Topic,
      images: Resource[],
      audio: Resource | undefined,
      manager: EntityManager
    ) => {
      //* vi -> en
      const forwardPrompt = this._connection.getRepository(Prompt).create();
      forwardPrompt.text = vocabulary.translation;
      forwardPrompt.image = images[0]?.uri;
      forwardPrompt.audio = audio?.uri;
      forwardPrompt.topic = infoTopic;
      const [forwardData, forwardError] = await trycat(
        manager.save(forwardPrompt)
      );
      if (forwardError)
        throw new exceptions.InternalServerError(
          'can not create prompt',
          this._logger,
          forwardError
        );
      const createdForwardPrompt: Prompt = forwardData as any;
      const learningLangOptions =
        infoTopic.vocabularies
          ?.filter((correct: Vocabulary) => correct.id !== vocabulary.id && correct.pos === vocabulary.pos)
          .map((item: Vocabulary) => item.vocabulary) || [];
      const learningLangAnswers: string[] = []; //* Ex: ['establish','opportunity', 'obligate]
      //* random answer
      this._randomAnswers(learningLangOptions, learningLangAnswers);

      if (learningLangAnswers.length === 3) {
        const forwardQuestion = this._questionRepository.create();
        //* shuffle answers
        forwardQuestion.choices = JSON.stringify(
          this._shuffle([...learningLangAnswers, vocabulary.vocabulary])
        );
        forwardQuestion.correctAnswer = vocabulary.vocabulary;
        forwardQuestion.action = QuestionAction.select;
        forwardQuestion.skills = [LearningSkill.reading];
        forwardQuestion.sourceLang = infoTopic.fromLang.code;
        forwardQuestion.targetLang = infoTopic.learningLang.code;
        forwardQuestion.type = QuestionType.translate;
        forwardQuestion.vocabulary = vocabulary;
        forwardQuestion.prompt = createdForwardPrompt;
        forwardQuestion.level = 1;
        await manager.save(forwardQuestion);
      }

      //* en -> vi
      const backwardPrompt = this._connection.getRepository(Prompt).create();
      backwardPrompt.text = vocabulary.vocabulary;
      backwardPrompt.image = images[0]?.uri;
      backwardPrompt.audio = audio?.uri;
      backwardPrompt.topic = infoTopic;
      const [backWardData, backWardError] = await trycat(
        manager.save(backwardPrompt)
      );
      if (backWardError)
        throw new exceptions.InternalServerError(
          'can not create prompt',
          this._logger,
          backWardError
        );
      const createdBackwardPrompt: Prompt = backWardData as any;

      const fromLangOptions =
        infoTopic.vocabularies
          ?.filter((correct: Vocabulary) => correct.id !== vocabulary.id && correct.pos === vocabulary.pos)
          .map((item: Vocabulary) => item.translation) || [];
      const fromLangAnswers: string[] = []; //* [ 'bắt buộc', 'cơ hội', 'thiết lặp' ]
      //* random answer

      this._randomAnswers(fromLangOptions, fromLangAnswers);
      if (fromLangAnswers.length === 3) {
        const backwardQuestion = this._questionRepository.create();
        //* shuffle answers
        backwardQuestion.choices = JSON.stringify(
          this._shuffle([...fromLangAnswers, vocabulary.translation])
        );
        backwardQuestion.correctAnswer = vocabulary.translation;
        backwardQuestion.action = QuestionAction.select;
        backwardQuestion.skills = [LearningSkill.reading];
        backwardQuestion.sourceLang = infoTopic.learningLang.code;
        backwardQuestion.targetLang = infoTopic.fromLang.code;
        backwardQuestion.type = QuestionType.translate;
        backwardQuestion.vocabulary = vocabulary;
        backwardQuestion.prompt = createdBackwardPrompt;
        backwardQuestion.level = 1;
        await manager.save(backwardQuestion);
      }
    },
    write: async (
      vocabulary: Vocabulary,
      infoTopic: Topic,
      images: Resource[],
      audio: Resource | undefined,
      manager: EntityManager
    ) => {
      const prompt = this._connection.getRepository(Prompt).create();
      prompt.text = vocabulary.translation;
      prompt.image = images[0]?.uri;
      prompt.audio = audio?.uri;
      prompt.topic = infoTopic;
      const [data, error] = await trycat(manager.save(prompt));
      if (error)
        throw new exceptions.InternalServerError(
          'can not create prompt',
          this._logger,
          error
        );
      const createdPrompt: Prompt = data as any;
      const question = this._questionRepository.create();
      question.action = QuestionAction.write;
      question.choices = JSON.stringify([]);
      question.correctAnswer = vocabulary.vocabulary;
      question.skills = [LearningSkill.writing, LearningSkill.reading];
      question.sourceLang = infoTopic.fromLang.code;
      question.targetLang = infoTopic.learningLang.code;
      question.type = QuestionType.translate;
      question.vocabulary = vocabulary;
      question.prompt = createdPrompt;
      question.level = 4;
      await manager.save(question);
    },
    type: async (
      vocabulary: Vocabulary,
      infoTopic: Topic,
      images: Resource[],
      audio: Resource | undefined,
      manager: EntityManager
    ) => {
      const prompt = this._connection.getRepository(Prompt).create();
      prompt.text = vocabulary.translation;
      prompt.image = images[0]?.uri;
      prompt.audio = audio?.uri;
      prompt.topic = infoTopic;
      const [data, error] = await trycat(manager.save(prompt));
      if (error)
        throw new exceptions.InternalServerError(
          'can not create prompt',
          this._logger,
          error
        );
      const createdPrompt: Prompt = data as any;
      const question = this._questionRepository.create();
      question.action = QuestionAction.type;
      question.choices = JSON.stringify([]);
      question.correctAnswer = vocabulary.vocabulary;
      question.skills = [LearningSkill.writing, LearningSkill.reading];
      question.sourceLang = infoTopic.fromLang.code;
      question.targetLang = infoTopic.learningLang.code;
      question.type = QuestionType.translate;
      question.vocabulary = vocabulary;
      question.prompt = createdPrompt;
      question.level = 3;
      await manager.save(question);
    },
    select_card: async (
      vocabulary: Vocabulary,
      infoTopic: Topic,
      images: Resource[],
      audio: Resource | undefined,
      manager: EntityManager
    ) => {
      //* en -> vi
      const fromLangExtraVocabularies =
        infoTopic.vocabularies?.filter(
          (correct: Vocabulary) => correct.id !== vocabulary.id && correct.pos === vocabulary.pos
        ) || [];
      const fromLangActualExtraCards: string[] = []; //* [ 'bắt buoc', 'cơ hội', 'ring beet', 'thiết lặp' ]
      this._randomExtraCards(
        fromLangExtraVocabularies,
        fromLangActualExtraCards,
        vocabulary,
        'backward'
      );
      const backWordImageCorrect = images[0]?.uri;
      if (fromLangActualExtraCards.length === 2 && backWordImageCorrect) {
        const backwardPrompt = this._connection.getRepository(Prompt).create();
        backwardPrompt.text = `Which of these is "${vocabulary.vocabulary}"`;
        backwardPrompt.audio = audio?.uri;
        backwardPrompt.topic = infoTopic;
        const [backwardData, backwardError] = await trycat(
          manager.save(backwardPrompt)
        );
        if (backwardError)
          throw new exceptions.InternalServerError(
            'can not create prompt',
            this._logger,
            backwardError
          );
        const createdBackwardPrompt: Prompt = backwardData as any;

        const backwardQuestion = this._questionRepository.create();

        //* shuffle answers
        backwardQuestion.choices = JSON.stringify(
          this._shuffle([
            ...fromLangActualExtraCards,
            {
              uri: backWordImageCorrect,
              description: vocabulary.translation,
            },
          ])
        );
        backwardQuestion.correctAnswer = vocabulary.translation;
        backwardQuestion.action = QuestionAction.select_card;
        backwardQuestion.skills = [LearningSkill.reading];
        backwardQuestion.sourceLang = infoTopic.learningLang.code;
        backwardQuestion.targetLang = infoTopic.fromLang.code;
        backwardQuestion.type = QuestionType.translate;
        backwardQuestion.vocabulary = vocabulary;
        backwardQuestion.prompt = createdBackwardPrompt;
        backwardQuestion.level = 1;

        await manager.save(backwardQuestion);
      }
      //* vi -> en
      const learningLangExtraVocabularies =
        infoTopic.vocabularies?.filter(
          (correct: Vocabulary) => correct.id !== vocabulary.id
        ) || [];
      const learningLangActualExtraCards: string[] = []; //* [ 'bắt buoc', 'cơ hội', 'ring beet', 'thiết lặp' ]
      this._randomExtraCards(
        learningLangExtraVocabularies,
        learningLangActualExtraCards,
        vocabulary,
        'forward'
      );
      const forwardImageCorrect = vocabulary.resources?.filter(
        (rs) => rs.category === ResourceCategory.image
      )[0]?.uri;

      if (learningLangActualExtraCards.length === 2 && forwardImageCorrect) {
        const forwardPrompt = this._connection.getRepository(Prompt).create();
        forwardPrompt.text = `Đâu là "${vocabulary.translation}"`;
        forwardPrompt.topic = infoTopic;
        forwardPrompt.audio = audio?.uri;
        const [forwardData, forwardError] = await trycat(
          manager.save(forwardPrompt)
        );
        if (forwardError)
          throw new exceptions.InternalServerError(
            'can not create prompt',
            this._logger,
            forwardError
          );
        const createdForwardPrompt: Prompt = forwardData as any;
        const forwardQuestion = this._questionRepository.create();

        //* shuffle answers
        forwardQuestion.choices = JSON.stringify(
          this._shuffle([
            ...learningLangActualExtraCards,
            {
              uri: forwardImageCorrect,
              description: vocabulary.vocabulary,
            },
          ])
        );
        forwardQuestion.correctAnswer = vocabulary.vocabulary;
        forwardQuestion.action = QuestionAction.select_card;
        forwardQuestion.skills = [LearningSkill.reading];
        forwardQuestion.sourceLang = infoTopic.fromLang.code;
        forwardQuestion.targetLang = infoTopic.learningLang.code;
        forwardQuestion.type = QuestionType.translate;
        forwardQuestion.vocabulary = vocabulary;
        forwardQuestion.prompt = createdForwardPrompt;
        forwardQuestion.level = 1;
        await manager.save(forwardQuestion);
      }
    },
    speak: () => {
      return;
    },
  };

  private _actionFillChallengeFactory: any = {
    select: async (
      vocabulary: Vocabulary,
      infoTopic: Topic,
      videoOrAudio: Resource,
      manager: EntityManager
    ) => {
      //* make extra choices from other words in the same topic
      const learningLangOptions =
        infoTopic.vocabularies
          ?.filter((correct: Vocabulary) => correct.id !== vocabulary.id)
          .map((item: Vocabulary) => item.vocabulary) || [];
      const learningLangAnswers: string[] = []; //* Ex: ['establish', 'contract', 'opportunity', 'obligate]

      this._randomAnswers(learningLangOptions, learningLangAnswers);
      
      if (learningLangAnswers.length === 3) {
        const prompt = this._connection.getRepository(Prompt).create();
        const re = new RegExp(vocabulary.vocabulary, 'gi');
        //* make blank
        prompt.text = videoOrAudio.transcript?.replace(
          re,
          '_'.repeat(vocabulary.vocabulary.length)
        );
        prompt.audio =
          videoOrAudio.category === ResourceCategory.audio
            ? videoOrAudio?.uri
            : undefined;
        prompt.video =
          videoOrAudio.category === ResourceCategory.video
            ? videoOrAudio?.uri
            : undefined;
        prompt.topic = infoTopic;
        const [data, error] = await trycat(manager.save(prompt));
        if (error)
          throw new exceptions.InternalServerError(
            'can not create prompt',
            this._logger,
            error
          );
        const createdPrompt: Prompt = data as any;
        const question = this._questionRepository.create();
        question.action = QuestionAction.select;
        question.type = QuestionType.fill;
        question.equipments = ['headphone'];
        question.choices = JSON.stringify(
          this._shuffle([...learningLangAnswers, vocabulary.vocabulary])
        );
        question.correctAnswer = vocabulary.vocabulary;
        question.targetLang = infoTopic.learningLang.code;
        question.sourceLang = infoTopic.learningLang.code;
        question.vocabulary = vocabulary;
        question.prompt = createdPrompt;
        question.skills = [LearningSkill.listening];
        question.level = 2;
        await trycat(manager.save(question));
      }
    },
    write: async (
      vocabulary: Vocabulary,
      infoTopic: Topic,
      videoOrAudio: Resource,
      manager: EntityManager
    ) => {
      const prompt = this._connection.getRepository(Prompt).create();
      const re = new RegExp(vocabulary.vocabulary, 'gi');
      prompt.text = videoOrAudio.transcript?.replace(
        re,
        '_'.repeat(vocabulary.vocabulary.length)
      );

      prompt.audio =
        videoOrAudio.category === ResourceCategory.audio
          ? videoOrAudio?.uri
          : undefined;
      prompt.video =
        videoOrAudio.category === ResourceCategory.video
          ? videoOrAudio?.uri
          : undefined;
      prompt.topic = infoTopic;
      const [data, error] = await trycat(manager.save(prompt));
      if (error)
        throw new exceptions.InternalServerError(
          'can not create prompt',
          this._logger,
          error
        );
      const createdPrompt: Prompt = data as any;
      const question = this._questionRepository.create();
      question.action = QuestionAction.write;
      question.type = QuestionType.fill;
      question.choices = JSON.stringify([]);
      question.correctAnswer = vocabulary.vocabulary;
      question.targetLang = infoTopic.learningLang.code;
      question.sourceLang = infoTopic.learningLang.code;
      question.vocabulary = vocabulary;
      question.equipments = ['headphone'];
      question.prompt = createdPrompt;
      question.skills = [LearningSkill.writing, LearningSkill.listening];
      question.level = 4;
      await trycat(manager.save(question));
    },
    type: async (
      vocabulary: Vocabulary,
      infoTopic: Topic,
      videoOrAudio: Resource,
      manager: EntityManager
    ) => {
      const prompt = this._connection.getRepository(Prompt).create();
      const re = new RegExp(vocabulary.vocabulary, 'gi');
      prompt.text = videoOrAudio.transcript?.replace(
        re,
        '_'.repeat(vocabulary.vocabulary.length)
      );
      prompt.audio =
        videoOrAudio.category === ResourceCategory.audio
          ? videoOrAudio?.uri
          : undefined;
      prompt.video =
        videoOrAudio.category === ResourceCategory.video
          ? videoOrAudio?.uri
          : undefined;
      prompt.topic = infoTopic;
      const [data, error] = await trycat(manager.save(prompt));
      if (error)
        throw new exceptions.InternalServerError(
          'can not create prompt',
          this._logger,
          error
        );
      const createdPrompt: Prompt = data as any;
      const question = this._questionRepository.create();
      question.action = QuestionAction.type;
      question.type = QuestionType.fill;
      question.choices = JSON.stringify([]);
      question.correctAnswer = vocabulary.vocabulary;
      question.targetLang = infoTopic.learningLang.code;
      question.sourceLang = infoTopic.learningLang.code;
      question.vocabulary = vocabulary;
      question.prompt = createdPrompt;
      question.equipments = ['headphone'];
      question.skills = [LearningSkill.writing, LearningSkill.listening];
      question.level = 3;
      await manager.save(question);
    },
    arrange: () => {
      return;
    },
    select_card: () => {
      return;
    },
    speak: () => {
      return;
    },
  };

  private _randomAnswers(words: string[], answers: string[]): any {
    if (words.length < 3) return [];
    if (answers.length === 3) return answers;
    const rand = words[Math.floor(Math.random() * words.length)];
    if (!answers.includes(rand)) {
      answers.push(rand);
    }
    return this._randomAnswers(words, answers);
  }

  private _randomVocabularies(
    vocabularyIds: string[],
    take: number,
    result: string[]
  ): any {
    if (vocabularyIds.length < take) return;
    if (result.length === take) return;
    const rand =
      vocabularyIds[Math.floor(Math.random() * vocabularyIds.length)];
    if (!result.includes(rand)) {
      result.push(rand);
    }
    return this._randomVocabularies(vocabularyIds, take, result);
  }

  private _randomExtraCards( 
    words: Vocabulary[],
    actualExtraCards: any[],
    vocabulary: Vocabulary,
    direction = 'backward'
  ): any {
    //* get two extra cards
    if (words.length < 2) return [];
    const extraCards: ExtraImageCard[] = [];
    //* find all images
    words.forEach((word) => {
      const images = word.resources?.filter(
        (rs: Resource) => rs.category === ResourceCategory.image
      );
      if (images && images.length > 0) {
        const randImage = images[Math.floor(Math.random() * images.length)];
        if (direction === 'backward') {
          extraCards.push({
            uri: randImage?.uri,
            description: word.translation,
          });
        } else {
          extraCards.push({
            uri: randImage?.uri,
            description: word.vocabulary,
          });
        }
      }
    });

    if (extraCards.length < 2) {
      return [];
    }
    if (actualExtraCards.length === 2) return actualExtraCards;
    const rand = extraCards[Math.floor(Math.random() * extraCards.length)];
    //* check duplicate image
    if (!actualExtraCards.includes(rand.uri)) {
      actualExtraCards.push(rand);
    }
    return this._randomExtraCards(
      words,
      actualExtraCards,
      vocabulary,
      direction
    );
  }

  private _shuffle(array: any[]) {
    return array.sort(() => Math.random() - 0.5);
  }

  private _getWrongForwardTokens(
    solutionSentence: Resource,
    extraSentences: Resource[],
    extraTokens: string[]
  ) {
    const solutionTokens = solutionSentence.transcript?.split(' ') || [];
    extraSentences.forEach((extraSentence) => {
      const tokens = extraSentence.transcript?.split(' ') || [];
      tokens.forEach((token: string) => {
        //* check token if it is in solution sentence
        if (!solutionTokens.includes(token)) extraTokens.push(token);
      });
    });
  }

  private _getWrongBackwardTokens(
    solutionSentence: Resource,
    extraSentences: Resource[],
    extraTokens: string[]
  ) {
    const solutionTokens = solutionSentence.translation?.split(' ') || [];
    extraSentences.forEach((extraSentence) => {
      const tokens = extraSentence.translation?.split(' ') || [];
      tokens.forEach((token) => {
        if (!solutionTokens.includes(token)) extraTokens.push(token);
      });
    });
  }

  private async _getWrongTokens(
    solutionSentence: Resource,
    direction = 'forward',
    vocabularies: Vocabulary[] = []
  ) {
    const extraTokens: any[] = [];
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < vocabularies.length; index++) {
      const vocabulary = vocabularies[index];
      const [data, error] = await trycat(
        this._connection.getRepository(Resource).find({
          where: {
            vocabularyId: vocabulary.id,
            transcript: Not(IsNull()),
            category: ResourceCategory.sentence,
          },
        })
      );
      if (error)
        throw new exceptions.InternalServerError(
          'Can not get extra sentences',
          this._logger,
          error
        );
      const extraSentences: Resource[] = data as any;
      if (extraSentences.length === 0) continue;

      if (direction === 'forward') {
        this._getWrongForwardTokens(
          solutionSentence,
          extraSentences,
          extraTokens
        );
      } else {
        this._getWrongBackwardTokens(
          solutionSentence,
          extraSentences,
          extraTokens
        );
      }
    }
    this._shuffle(extraTokens);
    //* filter duplicate
    return [...new Set(extraTokens)].slice(0, 4);
  }

  private _findQuestionBySkill(
    currentSkill: LearningSkill,
    restSkills: LearningSkill[],
    collectionQuestions: Question[]
  ) {
    let rs = null;
    for (let index = 0; index < collectionQuestions.length; index++) {
      if (collectionQuestions[index].skills?.includes(currentSkill)) {
        rs = collectionQuestions[index];
        break;
      }
    }
    if (!rs) {
      for (let i = 0; i < restSkills.length; i++) {
        for (let j = 0; j < collectionQuestions.length; j++) {
          if (collectionQuestions[j].skills?.includes(restSkills[i])) {
            rs = collectionQuestions[j];
            return rs;
          }
        }
      }
    }

    return rs;
  }

  private async _makeTranslateSentenceChallenges(
    infoTopic: Topic,
    vocabulary: Vocabulary,
    sentences: Resource[],
    manager: EntityManager
  ) {
    const createForwardSentencePromises = sentences.map(
      async (sentence: Resource) => {
        //* forward
        const prompt = this._connection.getRepository(Prompt).create();
        prompt.text = sentence.translation;
        prompt.topic = infoTopic;
        const [data, error] = await trycat(manager.save(prompt));
        if (error)
          throw new exceptions.InternalServerError(
            'can not create prompt',
            this._logger,
            error
          );
        const createdPrompt: Prompt = data as any;
        const question = this._questionRepository.create();
        question.sourceLang = infoTopic.fromLang.code;
        question.targetLang = infoTopic.learningLang.code;
        const extraVocabularies = infoTopic.vocabularies?.filter(
          (item) => item.id !== vocabulary.id
        );
        const wrongTokens = await this._getWrongTokens(
          sentence,
          'forward',
          extraVocabularies
        );
        const combineChoices = [
          ...wrongTokens,
          ...(sentence.transcript?.split(' ') ?? []),
        ];
        question.choices = JSON.stringify(this._shuffle(combineChoices));
        question.action = QuestionAction.arrange;
        question.correctAnswer = sentence.transcript || '';
        question.skills = [LearningSkill.reading, LearningSkill.writing];
        question.type = QuestionType.translate;
        question.vocabulary = vocabulary;
        question.prompt = createdPrompt;
        question.level = 2;
        return manager.save(question);
      }
    );
    const createBackwardSentencePromises = sentences.map(
      async (sentence: Resource) => {
        //* backward
        const prompt = this._connection.getRepository(Prompt).create();
        prompt.text = sentence.transcript;
        prompt.topic = infoTopic;
        const [data, error] = await trycat(manager.save(prompt));
        if (error)
          throw new exceptions.InternalServerError(
            'can not create prompt',
            this._logger,
            error
          );
        const createdPrompt: Prompt = data as any;
        const wrongTokens = await this._getWrongTokens(
          sentence,
          'backward',
          infoTopic.vocabularies?.filter((item) => item.id !== vocabulary.id)
        );
        const question = this._questionRepository.create();
        question.sourceLang = infoTopic.learningLang.code;
        question.targetLang = infoTopic.fromLang.code;
        const combineChoices = [
          ...wrongTokens,
          ...(sentence.translation?.split(' ') ?? []),
        ];
        question.choices = JSON.stringify(this._shuffle(combineChoices));
        question.action = QuestionAction.arrange;
        question.correctAnswer = sentence.translation || '';
        question.skills = [LearningSkill.reading, LearningSkill.writing];
        question.type = QuestionType.translate;
        question.vocabulary = vocabulary;
        question.prompt = createdPrompt;
        question.level = 2;
        return manager.save(question);
      }
    );
    try {
      await Promise.all(createForwardSentencePromises);
      await Promise.all(createBackwardSentencePromises);
    } catch (error) {
      throw new exceptions.InternalServerError(
        'Something wrong',
        this._logger,
        error
      );
    }
  }

  private async _makeTranslateWordChallenges(
    infoTopic: Topic,
    vocabulary: Vocabulary,
    images: Resource[],
    audio: Resource | undefined,
    manager: EntityManager
  ) {
    for (const action in QuestionAction) {
      if (Object.prototype.hasOwnProperty.call(QuestionAction, action)) {
        await this._actionTranslateWordChallengeFactory[action](
          vocabulary,
          infoTopic,
          images,
          audio,
          manager
        );
      }
    }
  }

  private async _removePromptByTopicId(topicId: string) {
    await this._connection.getRepository(Prompt).delete({
      topicId: topicId,
    });
  }
  private async _getQuestionForManyTopics(equipments: string[], vocabularyIds: string[], userId: string ) {
    let responses: Question[] = [];
    if (
      vocabularyIds &&
      vocabularyIds.length > 0
    ) {
      let skills: LearningSkill[] = [
        'reading',
        'listening',
        'writing',
        'speaking',
      ] as LearningSkill[];
      if (equipments.findIndex((e) => e === 'headphone') < 0) {
        skills = skills.filter((skill: string) => skill !== 'listening');
      }
      if (equipments.findIndex((e) => e === 'microphone') < 0) {
        skills = skills.filter((skill: string) => skill !== 'speaking');
      }
      this._shuffle(skills);

      const vocabularyIdsLength = vocabularyIds.length;
      for (let index = 0; index < vocabularyIdsLength; index++) {
        const vocabularyId = vocabularyIds[index];
        const infoVocabulary = await this._connection.getRepository(Vocabulary).findOne({id: vocabularyId}, {relations: ['topic']});
        if (!infoVocabulary) throw new exceptions.NotFoundError('Not found vocabulary', this._logger);
        const infoEnrollment = await this._connection.getRepository(Enrollment).findOne({
          where: {
            topicId: infoVocabulary.topicId,
            userId: userId
          }
        });
        if (!infoEnrollment) throw new exceptions.NotFoundError('Not found student', this._logger);
        
        let infoQuestion = null;
        const infoMemoryAnalysis = await this._connection
          .getRepository(MemoryAnalysis)
          .findOne({
            where: {
              vocabularyId: vocabularyId,
              studentId: infoEnrollment.id,
            },
            relations: ['actualSkills'],
          });
        let maxSkill = 0;
        if (infoMemoryAnalysis) {
          maxSkill = Math.max(
            ...[
              +infoMemoryAnalysis.actualSkills[0].percent,
              +infoMemoryAnalysis.actualSkills[1].percent,
              +infoMemoryAnalysis.actualSkills[2].percent,
              +infoMemoryAnalysis.actualSkills[3].percent,
            ]
          );
          
        }
        //* fake rate to get question suitable for memory ability 
        const num = Math.floor(Math.random() * 10 + 1);

        if (maxSkill >= 0 && maxSkill <= 0.19) {
          //* level 1
          infoQuestion = await this._getQuestionByLevel(
            [1],
            vocabularyId,
            equipments,
            skills,
            index
          );
        } else if (maxSkill >= 0.2 && maxSkill <= 0.49) {
          //* level 2
          if (num > 5) {
            infoQuestion = await this._getQuestionByLevel(
              [2],
              vocabularyId,
              equipments,
              skills,
              index
            );
          } else {
            infoQuestion = await this._getQuestionByLevel(
              [1],
              vocabularyId,
              equipments,
              skills,
              index
            );
          }
        } else if (maxSkill >= 0.5 && maxSkill <= 0.69) {
          //* level 3
          if (num > 5) {
            infoQuestion = await this._getQuestionByLevel(
              [3],
              vocabularyId,
              equipments,
              skills,
              index
            );
          } else {
            infoQuestion = await this._getQuestionByLevel(
              [1, 2],
              vocabularyId,
              equipments,
              skills,
              index
            );
          }
        } else {
          if (num > 5) {
            infoQuestion = await this._getQuestionByLevel(
              [4],
              vocabularyId,
              equipments,
              skills,
              index
            );
          } else {
            infoQuestion = await this._getQuestionByLevel(
              [1, 2, 3],
              vocabularyId,
              equipments,
              skills,
              index
            );
          }
        }
        responses = infoQuestion ? [...responses, infoQuestion] : responses;
      }
    }
    return responses;
  }

  private _filterQuestionNotSupport(
    equipments: string[],
    questions: Question[]
  ) {
    return questions.filter((q: Question) => {
      if (q.equipments.length === 0) return true;
      if (q.equipments.every((e: string) => equipments.includes(e))) {
        return true;
      }
      return false;
    });
  }

  private _classifyQuestions(
    questions: Question[],
    fillQuestion: Question[],
    translationQuestion: any,
    speakQuestions: Question[],
    shortInputQuestions: Question[]
  ) {
    questions.forEach((question: Question) => {
      switch (question.type) {
        case QuestionType.fill: {
          fillQuestion.push(question);
          break;
        }
        case QuestionType.translate: {
          if (
            question.action === QuestionAction.arrange &&
            question.sourceLang !== question.targetLang
          ) {
            translationQuestion.sentenceTranslationQuestions.push(question);
          } else {
            translationQuestion.wordTranslationQuestions.push(question);
          }
          break;
        }

        case QuestionType.speak:
          speakQuestions.push(question);
          break;

        case QuestionType.short_input: {
          shortInputQuestions.push(question);
          break;
        }
        default:
          break;
      }
    });
  }

  private async _createQuestionForVocabulary(
    vocabulary: Vocabulary,
    infoTopic: Topic,
    queryRunner: QueryRunner
  ) {
    for (const type in QuestionType) {
      const [data, error] = await trycat(
        queryRunner.manager.find(Resource, {
          //* find from transaction, because current data is not stored in db
          where: {
            vocabulary: vocabulary,
          },
        })
      );
      if (error)
        throw new exceptions.InternalServerError(
          'Can not get resource',
          this._logger,
          error
        );
      const resources: Resource[] = data as any;
      if (Object.prototype.hasOwnProperty.call(QuestionType, type)) {
        await this._typeChallengeFactory[type](
          resources,
          infoTopic,
          vocabulary,
          queryRunner.manager
        );
      }
    }
  }

  private async _getQuestionByLevel(
    levels: number[],
    vocabularyId: string,
    equipments: string[],
    skills: LearningSkill[],
    index: number
  ) {
    const [data, error] = await trycat(
      this._questionRepository
        .createQueryBuilder('question')
        .innerJoinAndSelect('question.prompt', 'prompt')
        .andWhere('question.vocabulary = :vocabularyId', {
          vocabularyId,
        })
        .andWhere('question.level IN (:...levels)', { levels })
        .getMany()
    );
    if (error)
      throw new exceptions.InternalServerError(
        'Can not get question',
        this._logger,
        error
      );
    let questions: any[] = data as any;
    questions = this._filterQuestionNotSupport(equipments, questions);
    //* question bank
    let collectionQuestions: Question[] = [];

    const fillQuestion: Question[] = [];
    const translationQuestion = {
      wordTranslationQuestions: [] as Question[],
      sentenceTranslationQuestions: [] as Question[],
    };
    const speakQuestions: Question[] = [];
    const shortInputQuestions: Question[] = [];

    //* classify questions
    this._classifyQuestions(
      questions,
      fillQuestion,
      translationQuestion,
      speakQuestions,
      shortInputQuestions
    );

    //* fill the blank
    collectionQuestions.push(...fillQuestion);
    //* translate(word)
    collectionQuestions.push(...translationQuestion.wordTranslationQuestions);
    //* translate(sentence)
    collectionQuestions.push(
      ...translationQuestion.sentenceTranslationQuestions
    );
    //* speak
    collectionQuestions.push(...speakQuestions);

    //* short input
    collectionQuestions.push(...shortInputQuestions);

    //* shuffle array questions
    const collectionQuestionIndexes: number[] = [];
    RandomUtil.getRandomIndexes(
      collectionQuestions.length,
      collectionQuestions.length,
      collectionQuestionIndexes
    );
    collectionQuestions = collectionQuestionIndexes.map(
      (item: number) => collectionQuestions[item]
    );

    //* load balance question by skill
    const currentSkill = skills[index % skills.length];
    //* in case question of current skill is not found
    const restSkills = skills.filter(
      (skill: LearningSkill) => skill !== currentSkill
    );
    return this._findQuestionBySkill(
      currentSkill,
      restSkills,
      collectionQuestions
    );
  }

  async generateQuestionsByTopicId(
    topicId: string,
    queryRunner: QueryRunner | null = null
  ) {
    let infoTopic = null;
    let isCalledOtherService = true;
    if (!queryRunner) {
      isCalledOtherService = false;
      queryRunner = this._connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      infoTopic = await queryRunner.connection.getRepository(Topic).findOne({
        where: {
          id: topicId,
        },
        relations: ['vocabularies', 'fromLang', 'learningLang'],
      });
    }
    await queryRunner.manager.delete(Prompt, {
      topicId: topicId,
    });
    infoTopic = await queryRunner.manager.findOne(Topic, topicId, {
      relations: [
        'vocabularies',
        'fromLang',
        'learningLang',
        'vocabularies.resources',
      ],
    });
    if (!infoTopic)
      throw new exceptions.NotFoundError('Not found topic', this._logger);

    if (infoTopic.vocabularies && infoTopic.vocabularies.length > 0) {
      try {
        const vocabulariesLength = infoTopic.vocabularies.length;
        for (let index = 0; index < vocabulariesLength; index++) {
          const vocabulary = infoTopic.vocabularies[index];
          await this._createQuestionForVocabulary(
            vocabulary,
            infoTopic,
            queryRunner
          );
        }
        if (!isCalledOtherService) {
          await queryRunner.commitTransaction();
        }
        return 'success';
      } catch (error) {
        this._logger.error(error);
        if (!isCalledOtherService) {
          await queryRunner.rollbackTransaction();
          return 'error';
        }
        throw new Error('Something is wrong');
      } finally {
        if (!isCalledOtherService) await queryRunner.release();
      }
    }
    return 'error';
  }

  async getQuestions(getQuestionArgs: GetQuestionArgs, identityId: string) {
    const infoUser = await this._connection
      .getRepository(User)
      .findOne({ identityId });
    if (!infoUser) throw new exceptions.NotFoundError('Not found user', this._logger);
    let responses: Question[] = [];
    if (
      getQuestionArgs.vocabularyIds &&
        getQuestionArgs.vocabularyIds.length > 0
    ) {
      let skills: LearningSkill[] = [
        'reading',
        'listening',
        'writing',
        'speaking',
      ] as LearningSkill[];
      //* check equipment and filter skill
      if (getQuestionArgs.equipments.findIndex((e) => e === 'headphone') < 0) {
        skills = skills.filter((skill: string) => skill !== 'listening');
      }
      if (getQuestionArgs.equipments.findIndex((e) => e === 'microphone') < 0) {
        skills = skills.filter((skill: string) => skill !== 'speaking');
      }
      this._shuffle(skills);

      const vocabularyIdsLength = getQuestionArgs.vocabularyIds.length;
      if (getQuestionArgs.topicId) {
        const infoStudent = await this._connection.getRepository(Enrollment).findOne({ userId: infoUser.id, topicId: getQuestionArgs.topicId });
        if (!infoStudent) throw new exceptions.NotFoundError('Not found enrollment', this._logger);
      
        for (let index = 0; index < vocabularyIdsLength; index++) {
          const vocabularyId = getQuestionArgs.vocabularyIds[index];
          let infoQuestion = null;
          //* determine level of memory analysis to get suitable question
          const infoMemoryAnalysis = await this._connection
            .getRepository(MemoryAnalysis)
            .findOne({
              where: {
                vocabularyId: vocabularyId,
                studentId: infoStudent.id,
              },
              relations: ['actualSkills'],
            });
          let maxSkill = 0;
          if (infoMemoryAnalysis) {
            maxSkill = Math.max(
              ...[
                +infoMemoryAnalysis.actualSkills[0].percent,
                +infoMemoryAnalysis.actualSkills[1].percent,
                +infoMemoryAnalysis.actualSkills[2].percent,
                +infoMemoryAnalysis.actualSkills[3].percent,
              ]
            );
            
          }
          //* fake rate to get question suitable for memory ability 
          const num = Math.floor(Math.random() * 10 + 1);
  
          if (maxSkill >= 0 && maxSkill <= 0.19) {
            //* level 1
            infoQuestion = await this._getQuestionByLevel(
              [1],
              vocabularyId,
              getQuestionArgs.equipments,
              skills,
              index
            );
          } else if (maxSkill >= 0.2 && maxSkill <= 0.49) {
            //* level 2
            if (num > 5) {
              infoQuestion = await this._getQuestionByLevel(
                [2],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            } else {
              infoQuestion = await this._getQuestionByLevel(
                [1],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            }
          } else if (maxSkill >= 0.5 && maxSkill <= 0.69) {
            //* level 3
            if (num > 5) {
              infoQuestion = await this._getQuestionByLevel(
                [3],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            } else {
              infoQuestion = await this._getQuestionByLevel(
                [1, 2],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            }
          } else {
            if (num > 5) {
              infoQuestion = await this._getQuestionByLevel(
                [4],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            } else {
              infoQuestion = await this._getQuestionByLevel(
                [1, 2, 3],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            }
          }
          responses = infoQuestion ? [...responses, infoQuestion] : responses;
        }
      } else {
        for (let index = 0; index < vocabularyIdsLength; index++) {
          const vocabularyId = getQuestionArgs.vocabularyIds[index];
          const infoVocabulary = await this._connection.getRepository(Vocabulary).findOne({id: vocabularyId});
          if (!infoVocabulary) throw new exceptions.NotFoundError('Not found vocabulary', this._logger);

          const infoStudent = await this._connection.getRepository(Enrollment).findOne({ userId: infoUser.id, topicId: infoVocabulary.topicId });
          if (!infoStudent) throw new exceptions.NotFoundError('Not found enrollment', this._logger);
          let infoQuestion = null;
          //* determine level of memory analysis to get suitable question
          const infoMemoryAnalysis = await this._connection
            .getRepository(MemoryAnalysis)
            .findOne({
              where: {
                vocabularyId: vocabularyId,
                studentId: infoStudent.id,
              },
              relations: ['actualSkills'],
            });
          let maxSkill = 0;
          if (infoMemoryAnalysis) {
            maxSkill = Math.max(
              ...[
                +infoMemoryAnalysis.actualSkills[0].percent,
                +infoMemoryAnalysis.actualSkills[1].percent,
                +infoMemoryAnalysis.actualSkills[2].percent,
                +infoMemoryAnalysis.actualSkills[3].percent,
              ]
            );
            
          }
          //* fake rate to get question suitable for memory ability 
          const num = Math.floor(Math.random() * 10 + 1);
  
          if (maxSkill >= 0 && maxSkill <= 0.19) {
            //* level 1
            infoQuestion = await this._getQuestionByLevel(
              [1],
              vocabularyId,
              getQuestionArgs.equipments,
              skills,
              index
            );
          } else if (maxSkill >= 0.2 && maxSkill <= 0.49) {
            //* level 2
            if (num > 5) {
              infoQuestion = await this._getQuestionByLevel(
                [2],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            } else {
              infoQuestion = await this._getQuestionByLevel(
                [1],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            }
          } else if (maxSkill >= 0.5 && maxSkill <= 0.69) {
            //* level 3
            if (num > 5) {
              infoQuestion = await this._getQuestionByLevel(
                [3],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            } else {
              infoQuestion = await this._getQuestionByLevel(
                [1, 2],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            }
          } else {
            if (num > 5) {
              infoQuestion = await this._getQuestionByLevel(
                [4],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            } else {
              infoQuestion = await this._getQuestionByLevel(
                [1, 2, 3],
                vocabularyId,
                getQuestionArgs.equipments,
                skills,
                index
              );
            }
          }
          responses = infoQuestion ? [...responses, infoQuestion] : responses;
        }
      }
    
    } 
    return responses;
  }
 
  async quickTest(quickTestArgs: QuickTestArgs, identityId: string) {
    const infoUser = await this._connection
      .getRepository(User)
      .findOne({ identityId });
    const collectionQuestions: Question[] = [];
    //* Equally divided number of questions
    const atLeastNumberOfQuestions = Math.floor(
      quickTestArgs.numberOfQuestions / quickTestArgs.topicIds.length
    );
    const modNumberOfQuestion =
      quickTestArgs.numberOfQuestions % quickTestArgs.topicIds.length;
    const divisionQuestion = quickTestArgs.topicIds.reduce(
      (pre: any, topicId: string) => {
        pre[topicId] = atLeastNumberOfQuestions;
        return pre;
      },
      {}
    );
      //* Round robin dived mod number of questions
    for (let index = 0; index < modNumberOfQuestion; index++) {
      const topicId =
        quickTestArgs.topicIds[index % quickTestArgs.topicIds.length];
      divisionQuestion[topicId] += 1;
    }
    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);
    for (const topicId of quickTestArgs.topicIds) {
      const selectedVocabularyIds: string[] = [];
      const infoTopic = await this._connection
        .getRepository(Topic)
        .findOne(topicId, { relations: ['vocabularies'] });
      if (!infoTopic)
        throw new exceptions.NotFoundError('Not found topic', this._logger);
      const infoEnrollment = await this._connection
        .getRepository(Enrollment)
        .findOne({
          userId: infoUser.id,
          topicId: infoTopic.id,
        });
      if (!infoEnrollment) {
        const newEnrollment = this._connection
          .getRepository(Enrollment)
          .create();
        newEnrollment.topic = infoTopic;
        newEnrollment.user = infoUser;
        await this._connection.getRepository(Enrollment).save(newEnrollment);
      }
      //* get all vocabularies of topic
      const vocabularyIds =
        infoTopic.vocabularies?.map((vocabulary) => vocabulary.id) || [];

      //* random vocabulary
      this._randomVocabularies(
        vocabularyIds,
        divisionQuestion[topicId],
        selectedVocabularyIds
      );

      const questions = await this._getQuestionForManyTopics(quickTestArgs.equipments, selectedVocabularyIds, infoUser.id);
      collectionQuestions.push(...questions);
    }
    //* random question
    this._shuffle(collectionQuestions);
    return collectionQuestions;
  }

  async findByPromptId(promptId: string) {
    const [data, error] = await trycat(
      this._connection.getRepository(Prompt).findOne(promptId)
    );
    if (error)
      throw new exceptions.InternalServerError(
        'Can not get prompt',
        this._logger,
        error
      );
    const prompt: Prompt = data as any;
    return prompt;
  }
}
