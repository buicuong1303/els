/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType } from '@nestjs/graphql';
import { pagination } from '@els/server/shared';
import { Rank } from '@els/server/learning/rank/data-access/entities';
@ObjectType()
export class PaginatedRank extends pagination.offset.Paginated(Rank) {}
