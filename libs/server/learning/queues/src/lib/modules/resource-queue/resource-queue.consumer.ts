/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Resource, ResourceCategory } from '@els/server/learning/common';
import { MinIoService, TextToSpeechService } from '@els/server/shared';
import { StringUtil } from '@els/shared/utils';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Connection } from 'typeorm';
@Processor('resource-queue')
export class ResourceQueueConsumer {
  private _logger: Logger = new Logger(ResourceQueueConsumer.name);
  constructor(
    private readonly _connection: Connection,
    private readonly _textToSpeechService: TextToSpeechService,
    private readonly _minIoService: MinIoService
  ) {}

  @Process({ name: 'handle-image-resource', concurrency: 1 })
  async handleImageResource(job: Job<any>, done: any) {
    try {
      const {
        text,
        topicName,
        category,
        specialization,
        vocabularyId,
        topicId,
      } = job.data;
      const tempPrefix = `temporary/assets/${StringUtil.normalize(
        topicName.toLowerCase()
      )}/image/${text.replace(/\s/g, '_')}/`;

      const prefix = `resources/topic/${StringUtil.normalize(
        category.toLowerCase()
      )}/${StringUtil.normalize(
        specialization.toLowerCase()
      )}/${StringUtil.normalize(topicName.toLowerCase())}/image/${text.replace(
        /\s/g,
        '_'
      )}`;
      const bucket = process.env.MINIO_BUCKET_NAME;
      await new Promise((r) => setTimeout(r, 3000));
      const listObjects = await this._minIoService.listObjects(
        bucket,
        tempPrefix
      );
      listObjects.forEach(async (obj) => {
        const fileName = obj.name.split('/').pop();
        //* download file
        const buffer = (await this._minIoService.getObject(
          bucket,
          obj.name
        )) as Buffer;

        //* upload file
        await this._minIoService.uploadFile(
          process.env.MINIO_BUCKET_NAME,
          `${prefix}/${fileName}`,
          'image/png',
          buffer
        );

        //* create resource
        const newResourceImage = this._connection
          .getRepository(Resource)
          .create();
        newResourceImage.category = ResourceCategory.image;
        newResourceImage.uri = `${process.env.MINIO_PUBLIC_HOST}/${process.env.MINIO_BUCKET_NAME}/${prefix}/${fileName}`;
        newResourceImage.isWord = true;
        newResourceImage.vocabularyId = vocabularyId;
        newResourceImage.topicId = topicId;
        await this._connection.getRepository(Resource).save(newResourceImage);
      });

      done();
    } catch (ex) {
      this._logger.error(ex);
      done(new Error(`Get audio for ${job.data.text}`));
    }
  }

  @Process({ name: 'handle-sentence-audio-resource', concurrency: 1 })
  async handleSentenceAudioResource(job: Job<any>, done: any) {
    try {
      const {
        text,
        topicName,
        category,
        specialization,
        vocabularyId,
        topicId,
      } = job.data;
      const tempPrefix = `temporary/assets/${StringUtil.normalize(
        topicName.toLowerCase()
      )}/sentence-audio/${text.replace(/\s/g, '_')}/`;

      const prefix = `resources/topic/${StringUtil.normalize(
        category.toLowerCase()
      )}/${StringUtil.normalize(
        specialization.toLowerCase()
      )}/${StringUtil.normalize(
        topicName.toLowerCase()
      )}/sentence-audio/${text.replace(/\s/g, '_')}`;
      
      const bucket = process.env.MINIO_BUCKET_NAME;
      await new Promise((r) => setTimeout(r, 2000));
      const listObjects = await this._minIoService.listObjects(
        bucket,
        tempPrefix
      );
      listObjects.forEach(async (obj) => {
        //* download file
        const buffer = (await this._minIoService.getObject(
          bucket,
          obj.name
        )) as Buffer;
        const transcript = buffer.toString();
        //* convert text to speech
        const uri = await this._textToSpeechService.textToSpeech(
          transcript,
          prefix
        );
        //* create resource
        const newResource = this._connection.getRepository(Resource).create();
        newResource.category = ResourceCategory.audio;
        newResource.uri = uri;
        newResource.isWord = false;
        newResource.vocabularyId = vocabularyId;
        newResource.transcript = transcript;
        newResource.topicId = topicId;
        await this._connection.getRepository(Resource).save(newResource);
      });

      done();
    } catch (ex) {
      this._logger.error(ex);
      done(new Error(`Get audio for ${job.data.text}`));
    }
  }

  @Process({ name: 'handle-audio-resource', concurrency: 1 })
  async handleAudioResource(job: Job<any>, done: any) {
    try {
      const {
        text,
        topicName,
        category,
        specialization,
        vocabularyId,
        availableAudios,
        topicId,
      } = job.data;
      const prefix = `resources/topic/${StringUtil.normalize(
        category.toLowerCase()
      )}/${StringUtil.normalize(
        specialization.toLowerCase()
      )}/${StringUtil.normalize(topicName.toLowerCase())}/audio`;
      if (availableAudios.includes(text.trim().replace(/\s/g, '_'))) {
        //* create resource
        const newResource = this._connection.getRepository(Resource).create();
        newResource.category = ResourceCategory.audio;
        newResource.uri = `${process.env.MINIO_PUBLIC_HOST}/${
          process.env.MINIO_BUCKET_NAME
        }/${prefix}/${text.replace(/\s/g, '_')}.mp3`;
        newResource.isWord = true;
        newResource.vocabularyId = vocabularyId;
        newResource.topicId = topicId;
        await this._connection.getRepository(Resource).save(newResource);
      } else {
        await new Promise((r) => setTimeout(r, 3000));
        const uri = await this._textToSpeechService.textToSpeech(text, prefix);
        //* create resource
        const newResource = this._connection.getRepository(Resource).create();
        newResource.category = ResourceCategory.audio;
        newResource.uri = uri;
        newResource.isWord = true;
        newResource.vocabularyId = vocabularyId;
        newResource.topicId = topicId;
        await this._connection.getRepository(Resource).save(newResource);
      }

      done();
    } catch (ex) {
      this._logger.error(ex);
      done(new Error(`Get audio for ${job.data.text}`));
    }
  }
}
