import { Field, ObjectType } from '@nestjs/graphql';
import { Type } from '@nestjs/common';
import { OffsetPageInfo } from './page-info';

/**
 * Based on https://docs.nestjs.com/graphql/resolvers#generics
 *
 * @param classRef
 */

export interface IPaginatedType<T> {
  nodes: T[];
  pageInfo: OffsetPageInfo;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType {
    @Field(() => [classRef], { nullable: true })
    nodes!: T[];

    @Field(() => OffsetPageInfo, { nullable: true })
    pageInfo?: OffsetPageInfo;
  }
  return PaginatedType as Type<IPaginatedType<T>>;
}
