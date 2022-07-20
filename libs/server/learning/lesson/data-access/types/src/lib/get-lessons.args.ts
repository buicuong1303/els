import { Field, ArgsType } from '@nestjs/graphql';
// import { pagination } from '@els/server/shared'
// @ArgsType()
// export class GetLessonsArgs extends pagination.cursor.PaginationArgs {
//   @Field(() => [String], { nullable: 'itemsAndList' })
//   ids?: string[];

// }
@ArgsType()
export class GetLessonsArgs{
  @Field(() => [String], { nullable: 'itemsAndList' })
  ids?: string[];

}
