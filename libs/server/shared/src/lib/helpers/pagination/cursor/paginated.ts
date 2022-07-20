import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { CursorPageInfo } from './page-info';

/**
 * Based on https://docs.nestjs.com/graphql/resolvers#generics
 *
 * @param classRef
 */

export interface IPaginatedType<T> {
  nodes: T[];
  pageInfo: CursorPageInfo;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef], { nullable: true })
    nodes!: T[];

    @Field(() => CursorPageInfo, { nullable: true })
    pageInfo?: CursorPageInfo;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
