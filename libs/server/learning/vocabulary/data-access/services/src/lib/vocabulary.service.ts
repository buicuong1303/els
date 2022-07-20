/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ResourceCategory } from '@els/server/learning/common';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';
import { Topic } from '@els/server/learning/topic/data-access/entities';
import {
  Resource,
  Vocabulary,
} from '@els/server/learning/vocabulary/data-access/entities';
import {
  CreateAudioResourceInput,
  CreateSentenceResourceInput,
  CreateVideoResourceInput,
  CreateVocabularyInput,
} from '@els/server/learning/vocabulary/data-access/types';
import {
  DictionaryGrpcServiceClient,
  exceptions,
  MinIoService,
} from '@els/server/shared';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, IsNull, Not, Repository } from 'typeorm';
import { GenerateResourceInput } from '@els/server/learning/vocabulary/data-access/types';
import { ResourceQueueService } from '@els/server/learning/queues';
import { StringUtil } from '@els/shared/utils';
export class VocabularyService {
  private readonly _logger = new Logger(VocabularyService.name);
  constructor(
    @InjectRepository(Vocabulary)
    private readonly _vocabularyRepository: Repository<Vocabulary>,
    @InjectRepository(Resource)
    private readonly _resourceRepository: Repository<Resource>,
    private readonly connection: Connection,
    private readonly _dictionaryGrpcServiceClient: DictionaryGrpcServiceClient,
    private readonly _resourceQueueService: ResourceQueueService,
    private readonly _minIoService: MinIoService
  ) {}

  private async _createVideoResources(
    vocabulary: Vocabulary,
    videos: CreateVideoResourceInput[]
  ) {
    const createVideoPromises = videos.map(
      (video: CreateVideoResourceInput) => {
        const newVideo = this._resourceRepository.create(video);
        newVideo.vocabulary = vocabulary;
        newVideo.vocabularyId = vocabulary.id;
        newVideo.category = ResourceCategory.video;
        return this._resourceRepository.save(newVideo);
      }
    );
    await Promise.all(createVideoPromises);
  }

  private async _createAudioResources(
    vocabulary: Vocabulary,
    audios: CreateAudioResourceInput[]
  ) {
    const createAudioPromises = audios.map(
      (audio: CreateAudioResourceInput) => {
        const newAudio = this._resourceRepository.create(audio);
        newAudio.vocabulary = vocabulary;
        newAudio.vocabularyId = vocabulary.id;
        newAudio.category = ResourceCategory.audio;
        return this._resourceRepository.save(newAudio);
      }
    );
    await Promise.all(createAudioPromises);
  }

  private async _createSentenceResources(
    vocabulary: Vocabulary,
    sentences: CreateSentenceResourceInput[]
  ) {
    const createSentencePromises = sentences.map(
      (sentence: CreateSentenceResourceInput) => {
        const newSentence = this._resourceRepository.create(sentence);
        newSentence.vocabulary = vocabulary;
        newSentence.vocabularyId = vocabulary.id;
        newSentence.category = ResourceCategory.sentence;
        newSentence.transcript = sentence.sentence;
        return this._resourceRepository.save(newSentence);
      }
    );
    await Promise.all(createSentencePromises);
  }

  async createVocabulary(createVocabularyInput: CreateVocabularyInput) {
    const { topicId, lessonsId, videos, audios, sentences } =
      createVocabularyInput;
    const topic = await this.connection.getRepository(Topic).findOne(topicId);
    if (!topic) throw new exceptions.NotFoundError('Not found', this._logger);

    const lesson = await this.connection
      .getRepository(Lesson)
      .findOne(lessonsId);
    if (!lesson) throw new exceptions.NotFoundError('Not found', this._logger);

    try {
      const vocabulary = this._vocabularyRepository.create(
        createVocabularyInput
      );
      vocabulary.topic = topic;
      vocabulary.lesson = lesson;
      const vocabularyCreated = await this._vocabularyRepository.save(
        vocabulary
      );
      if (videos && videos.length > 0) {
        this._createVideoResources(vocabularyCreated, videos);
      }
      if (audios && audios.length > 0) {
        this._createAudioResources(vocabularyCreated, audios);
      }
      if (sentences && sentences.length > 0) {
        this._createSentenceResources(vocabulary, sentences);
      }
    } catch (error) {
      throw new exceptions.InternalServerError(
        'Internal server',
        this._logger,
        error
      );
    }
  }

  async findByTopicId(topicId: string) {
    return this._vocabularyRepository.find({ topicId });
  }

  async findByLessonId(lessonId: string) {
    return this._vocabularyRepository.find({ lessonId });
  }

  async deleteVocabulariesByIds(ids: string[]) {
    let affected = 0;
    for (let index = 0; index < ids.length; index++) {
      const vocabulary = await this._vocabularyRepository.findOne({
        id: ids[index],
      });
      if (!vocabulary)
        throw new exceptions.NotFoundError('Not found', this._logger);
      this._vocabularyRepository.softRemove(vocabulary);
      affected += 1;
    }
    return {
      affected: affected,
    };
  }

  async restoreVocabulariesByIds(ids: string[]) {
    let affected = 0;
    for (let index = 0; index < ids.length; index++) {
      const vocabulary = await this._vocabularyRepository.findOne(
        { id: ids[index] },
        { withDeleted: true } //* must have relation to auto restore related children
      );
      if (!vocabulary)
        throw new exceptions.NotFoundError('Not found', this._logger);
      this._vocabularyRepository.recover(vocabulary);
      affected += 1;
    }
    return {
      affected: affected,
    };
  }

  async getVocabulariesByIds(ids: string[]) {
    return this._vocabularyRepository.findByIds(ids);
  }

  async getAudioResource(vocabularyId: string) {
    const audio = await this.connection.getRepository(Resource).findOne({
      where: {
        category: ResourceCategory.audio,
        isWord: true,
        vocabularyId,
      },
    });
    return audio?.uri || null;
  }

  async getImageResource(vocabularyId: string) {
    const images = await this.connection.getRepository(Resource).find({
      where: {
        category: ResourceCategory.image,
        vocabularyId,
      },
    });

    if (images) {
      const index = Math.floor(Math.random() * images.length);
      return images[index]?.uri || null;
    }
    return null;
  }

  private async _linkWord(vocabulary: Vocabulary) {
    const reference = await this._dictionaryGrpcServiceClient.getReference({
      vocabulary: vocabulary.vocabulary,
      langCode: 'en',
      pos: vocabulary.pos,
    });
    if (reference.referenceId) {
      vocabulary.referenceId = reference.referenceId;
      vocabulary.phonetic = reference.phonetic
        ? reference.phonetic
        : vocabulary.phonetic;
      vocabulary.type = reference.type;
    }
    await this._vocabularyRepository.save(vocabulary);
  }
  syncDictionary(vocabularies: Vocabulary[], cbSyncDictionary: any) {
    const length = vocabularies.length;
    const FIRST_ITEM_FOR_LOOP = 0;
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    async function helpSplit(i: number, cbHelpSplit: any) {
      const vocabulary = vocabularies[i];
      self._linkWord(vocabulary);
      if (i === length - 1) return cbHelpSplit();
      setImmediate(helpSplit.bind(null, i + 1, cbHelpSplit)); // setImmediate giúp chuyển sang tick tiếp theo và đợi đến phase tiếp theo với giá trị i+1 và sẵn sàng nhận các external event(request) để xử lý (tham khảo: https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
    }

    helpSplit(FIRST_ITEM_FOR_LOOP, () => {
      return cbSyncDictionary();
    });
  }

  async generateResource(generateResourceInput: GenerateResourceInput) {
    try {
      const infoTopic = await this.connection.getRepository(Topic).findOne({
        where: {
          id: generateResourceInput.topicId,
          categoryId: Not(IsNull()),
          specializationId: Not(IsNull()),
        },
        relations: ['category', 'specialization'],
      });
      if (!infoTopic || !infoTopic.category || !infoTopic.specialization)
        throw new exceptions.NotFoundError('Topic is invalid', this._logger);
      switch (generateResourceInput.category) {
        case 'audio': { 
          const vocabularies = await this.connection
            .getRepository(Vocabulary)
            .find({
              topicId: generateResourceInput.topicId,
            });

          await this.connection.getRepository(Resource).delete({
            category: ResourceCategory.audio,
            isWord: true,
            topicId: generateResourceInput.topicId,
          });

          const prefix = `resources/topic/${StringUtil.normalize(
            infoTopic.category.name.toLowerCase()
          )}/${StringUtil.normalize(
            infoTopic.specialization.name.toLowerCase()
          )}/${StringUtil.normalize(infoTopic.name.toLowerCase())}/audio/`;

          const listObjects = await this._minIoService.listObjects(
            process.env.MINIO_BUCKET_NAME || 'els',
            prefix
          );
          const availableAudios = listObjects.map(
            (obj: any) => obj.name.split('/').pop().split('.')[0]
          );
          for (const vocabulary of vocabularies) {
            this._resourceQueueService.handleAudioResource(
              infoTopic.id,
              infoTopic.name,
              infoTopic.category.name,
              infoTopic.specialization.name,
              vocabulary.vocabulary,
              vocabulary.id,
              availableAudios
            );
          }
          break;
        }
        case 'image': {
          const vocabularies = await this.connection
            .getRepository(Vocabulary)
            .find({
              topicId: generateResourceInput.topicId,
            });
          await this.connection.getRepository(Resource).delete({
            category: ResourceCategory.image,
          });
          for (const vocabulary of vocabularies) {
            this._resourceQueueService.handleImageResource(
              infoTopic.id,
              infoTopic.name,
              infoTopic.category.name,
              infoTopic.specialization.name,
              vocabulary.vocabulary,
              vocabulary.id
            );
          }
          break;
        }
        case 'sentence-audio': {
          const vocabularies = await this.connection
            .getRepository(Vocabulary)
            .find({
              topicId: generateResourceInput.topicId,
            });
          await this.connection.getRepository(Resource).delete({
            category: ResourceCategory.audio,
            isWord: false,
          });
          for (const vocabulary of vocabularies) {
            this._resourceQueueService.handleSentenceAudioResource(
              infoTopic.id,
              infoTopic.name,
              infoTopic.category.name,
              infoTopic.specialization.name,
              vocabulary.vocabulary,
              vocabulary.id
            );
          }
          break;
        }
        default:
          break;
      }
      return 'success';
    } catch (error) {
      throw new exceptions.InternalServerError(
        'Can not generate resource',
        this._logger,
        error
      );
    }
  }
  async generateResourceForAllTopic(
    generateResourceInput: GenerateResourceInput
  ) {
    try {
      switch (generateResourceInput.category) {
        case 'audio': {
          const topics = await this.connection.getRepository(Topic).find({
            where: {
              categoryId: Not(IsNull()),
              specializationId: Not(IsNull()),
            },
            relations: ['category', 'specialization'],
          });
          if (topics.length > 0) {
            const genResourceTopics = topics.map(async (topic: Topic) => {
              // if (topic.id !== '9650bbb5-ba57-4fd6-9db3-1ad03abfbadf') return;
              await this.connection.getRepository(Resource).delete({
                category: ResourceCategory.audio,
                isWord: true,
                topicId: topic.id,
              });
              const vocabularies = await this.connection
                .getRepository(Vocabulary)
                .find({
                  topicId: topic.id,
                });

              const prefix = `topic/${StringUtil.normalize(
                topic.category.name.toLowerCase()
              )}/${StringUtil.normalize(
                topic.specialization.name.toLowerCase()
              )}/${StringUtil.normalize(topic.name.toLowerCase())}/audio/`;

              const listObjects = await this._minIoService.listObjects(
                'resources',
                prefix
              );
              const availableAudios = listObjects.map(
                (obj: any) => obj.name.split('/').pop().split('.')[0]
              );
          
              for (const vocabulary of vocabularies) {
                this._resourceQueueService.handleAudioResource(
                  topic.id,
                  topic.name,
                  topic.category.name,
                  topic.specialization.name,
                  vocabulary.vocabulary,
                  vocabulary.id,
                  availableAudios
                );
              }
            });
            await Promise.all(genResourceTopics);
          }

          break;
        }
        case 'image': {
          const topics = await this.connection.getRepository(Topic).find({
            where: {
              categoryId: Not(IsNull()),
              specializationId: Not(IsNull()),
            },
            relations: ['category', 'specialization'],
          });

          if (topics.length > 0) {
            const genResourceTopics = topics.map(async (topic: Topic) => {
              await this.connection.getRepository(Resource).delete({
                category: ResourceCategory.image,
                topicId: topic.id,
              });
              const vocabularies = await this.connection
                .getRepository(Vocabulary)
                .find({
                  topicId: topic.id,
                });

              for (const vocabulary of vocabularies) {
                this._resourceQueueService.handleImageResource(
                  topic.id,
                  topic.name,
                  topic.category.name,
                  topic.specialization.name,
                  vocabulary.vocabulary,
                  vocabulary.id
                );
              }
            });
            await Promise.all(genResourceTopics);
          }
          break;
        }
        case 'sentence-audio': {
          const topics = await this.connection.getRepository(Topic).find({
            where: {
              categoryId: Not(IsNull()),
              specializationId: Not(IsNull()),
            },
            relations: ['category', 'specialization'],
          });

          if (topics.length > 0) {
            const genResourceTopics = topics.map(async (topic: Topic) => {
              await this.connection.getRepository(Resource).delete({
                category: ResourceCategory.image,
                topicId: topic.id,
                isWord: false,
              });
              const vocabularies = await this.connection
                .getRepository(Vocabulary)
                .find({
                  topicId: topic.id,
                });

              for (const vocabulary of vocabularies) {
                this._resourceQueueService.handleSentenceAudioResource(
                  topic.id,
                  topic.name,
                  topic.category.name,
                  topic.specialization.name,
                  vocabulary.vocabulary,
                  vocabulary.id
                );
              }
            });
            await Promise.all(genResourceTopics);
            break;
          }
          break;
        }
        default:
          break;
      }
      return 'success';
    } catch (error) {
      throw new exceptions.InternalServerError(
        'Can not generate resource',
        this._logger,
        error
      );
    }
  }
  async linkWords(topicId: string) {
    const vocabularies = await this._vocabularyRepository.find({
      where: {
        referenceId: IsNull(),
        topicId: topicId,
      },
    });
    try {
      this.syncDictionary(vocabularies, () => {
        this._logger.debug('link reference done');
      });
      return 'success';
    } catch (error) {
      throw new exceptions.InternalServerError(
        'Can not link word',
        this._logger,
        error
      );
    }
  }
}
