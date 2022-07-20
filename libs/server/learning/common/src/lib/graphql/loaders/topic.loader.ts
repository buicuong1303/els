/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';

import { Topic } from '@els/server/learning/topic/data-access/entities';
import { TopicService } from '@els/server/learning/topic/data-access/services';
export const createTopicsLoader = (topicService: TopicService) => {
  return new DataLoader(async (ids: readonly string[]) => {
    //* get distinct topic
    const topics: Topic[] = await topicService.getTopicsByIds([...ids]);

    const topicsMap = new Map(topics.map(topic => [topic.id, topic]));
    return ids.map((id) => topicsMap.get(id));
  });
};
