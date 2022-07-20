/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ResourceQueueProducer } from './resource-queue.producer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ResourceQueueService {
  constructor(private readonly resourceQueueProducer: ResourceQueueProducer) {}

  //* Message but change to any to ignore build failed
  async textToSpeak(text: string, prefix: string, resourceId: string) {
    this.resourceQueueProducer.textToSpeak(text, prefix, resourceId);
  }

  async handleImageResource(
    topicId: string,
    topicName: string,
    category: string,
    specialization: string,
    text: string,
    vocabularyId
  ) {
    this.resourceQueueProducer.handleImageResource(
      topicId,
      topicName,
      category,
      specialization,
      text,
      vocabularyId
    );
  }

  async handleSentenceAudioResource(
    topicId: string,
    topicName: string,
    category: string,
    specialization: string,
    text: string,
    vocabularyId
  ) {
    this.resourceQueueProducer.handleSentenceAudioResource(
      topicId,
      topicName,
      category,
      specialization,
      text,
      vocabularyId
    );
  }

  async handleAudioResource(
    topicId: string,
    topicName: string,
    category: string,
    specialization: string,
    text: string,
    vocabularyId,
    availableAudios: string[]
  ) {
    this.resourceQueueProducer.handleAudioResource(
      topicId,
      topicName,
      category,
      specialization,
      text,
      vocabularyId,
      availableAudios
    );
  }
}
