import {
  Comment,
  Entity
} from '@els/server/learning/comment/data-access/schemas';
import { CommentService } from '@els/server/learning/comment/data-access/services';
import { CommentMutations } from '@els/server/learning/comment/data-access/types';
import { User } from '@els/server/learning/user/data-access/entities';
import { checkCache, GqlContext } from '@els/server/shared';
import {
  Args,
  Context, Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import DataLoader = require('dataloader');
@Resolver(() => Comment)
export class CommentResolver {
  constructor(private readonly _commentService: CommentService) {}

  @Mutation(() => CommentMutations, {
    nullable: true,
    description: 'Root mutation for all comment related comments',
    name: 'comment',
  })
  commentMutations() {
    return {};
  }

  @Query(() => [Comment], { nullable: true })
  comments(
  @Args('entityName') entityName: string,
    @Args('entityId') entityId: string,
    // @Info() info: any
  ) {
    // info.cacheControl.setCacheHint({ scope: 'PUBLIC', maxAge: 45 });
    return this._commentService.findAllCommentsByEntity(entityName, entityId);
  }

  @Query(() => [Comment], { nullable: true })
  evaluations(
  @Args('entityName') entityName: string,
    @Args('entityId') entityId: string,
    @Context() ctx: GqlContext
    // @Info() info: any
  ) {
    //* Just working for InMemoryCaching
    // info.cacheControl.setCacheHint({ scope: 'PUBLIC', maxAge: 45 });
    return checkCache(ctx.cache, `data-caching:evaluations:${entityName}:${entityId}`, this._commentService.findAllEvaluationsByEntity.bind(this._commentService, entityName, entityId));
  }

  @ResolveField()
  async entity(
  @Parent() comment: Comment,
    @Context('entitiesLoader')
    entitiesLoader: DataLoader<mongoose.Schema.Types.ObjectId, Entity>
  ) {
    return entitiesLoader.load(comment.entity._id);
  }

  @ResolveField()
  async user(
  @Parent() comment: Comment,
    @Context('usersLoader') usersLoader: DataLoader<string, User>
  ) {
    return usersLoader.load(comment.userId);
  }

  @ResolveField()
  async reactions(@Parent() comment: Comment) {
    return this._commentService.getReactionsByCommentId(comment._id);
  }
}
