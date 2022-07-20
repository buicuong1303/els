/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import * as DataLoader from 'dataloader';

import { CommentService } from '@els/server/learning/comment/data-access/services';
import { Entity } from '@els/server/learning/comment/data-access/schemas';
export const createEntitiesLoader = (commentService: CommentService) => {
  return new DataLoader(async (ids: readonly any[]) => {
    //* get distinct enrollments
    const entities: Entity[] = await commentService.getEntityByIds([...ids]);
    const entitiesMap = new Map(
      entities.map((entity) => [entity._id.toString(), entity])
    );
    return ids.map((id: any) => entitiesMap.get(id.toString()));
  });
};
