import { ObjectType } from '@nestjs/graphql';
import { pagination } from '@els/server/shared';
import { Lesson } from '@els/server/learning/lesson/data-access/entities';

@ObjectType()
export class PaginatedLesson extends pagination.cursor.Paginated(Lesson) {}
