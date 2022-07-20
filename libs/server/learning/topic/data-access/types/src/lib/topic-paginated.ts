/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType } from '@nestjs/graphql';
import { pagination } from '@els/server/shared';
import { Topic } from '@els/server/learning/topic/data-access/entities';
@ObjectType()
export class PaginatedTopic extends pagination.offset.Paginated(Topic) {}
