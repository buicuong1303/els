/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { MissionQueueService } from '@els/server/learning/queues';
import { GqlContext } from '@els/server/shared';
export interface LearningGqlContext extends GqlContext {
  queue: { missionQueue: MissionQueueService };
}
