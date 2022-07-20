import { ObjectType } from '@nestjs/graphql';
import { Paginated } from '@els/server/shared';
import { Course } from '@els/server/learning/course/data/access/entities';

@ObjectType()
export class PaginatedEmployee extends Paginated(Course) {}
