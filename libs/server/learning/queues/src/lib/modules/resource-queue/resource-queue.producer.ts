/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class ResourceQueueProducer {
  constructor(
    @InjectQueue('resource-queue')
    private readonly _ttsQueue: Queue
  ) {}

  async textToSpeak(text: string, prefix: string, resourceId: string) {
    const jobInsert = await this._ttsQueue.add(
      'text-to-speak',
      {
        text,
        prefix,
        resourceId,
      },
      {
        removeOnComplete: process.env.NODE_ENV === 'development' ? false : true,
        removeOnFail: false,
        attempts: 4,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
      }
    );

    return jobInsert;
  }

  async handleImageResource(
    topicId: string,
    topicName: string,
    category: string,
    specialization: string,
    text: string,
    vocabularyId: string
  ) {
    const jobInsert = await this._ttsQueue.add(
      'handle-image-resource',
      {
        topicId,
        topicName,
        category,
        specialization,
        text,
        vocabularyId,
      },
      {
        removeOnComplete: process.env.NODE_ENV === 'development' ? false : true,
        removeOnFail: false,
        attempts: 4,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
      }
    );

    return jobInsert;
  }
  async handleSentenceAudioResource(
    topicId: string,
    topicName: string,
    category: string,
    specialization: string,
    text: string,
    vocabularyId: string
  ) {
    const jobInsert = await this._ttsQueue.add(
      'handle-sentence-audio-resource',
      {
        topicId,
        topicName,
        category,
        specialization,
        text,
        vocabularyId,
      },
      {
        removeOnComplete: process.env.NODE_ENV === 'development' ? false : true,
        removeOnFail: false,
        attempts: 4,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
      }
    );

    return jobInsert;
  }
  async handleAudioResource(
    topicId: string,
    topicName: string,
    category: string,
    specialization: string,
    text: string,
    vocabularyId: string,
    availableAudios: string[]
  ) {
    const jobInsert = await this._ttsQueue.add(
      'handle-audio-resource',
      {
        topicId,
        topicName,
        category,
        specialization,
        text,
        vocabularyId,
        availableAudios,
      },
      {
        removeOnComplete: process.env.NODE_ENV === 'development' ? false : true,
        removeOnFail: false,
        attempts: 4,
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
      }
    );

    return jobInsert;
  }
}
