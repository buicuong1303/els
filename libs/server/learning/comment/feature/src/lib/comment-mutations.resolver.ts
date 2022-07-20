import { Comment } from '@els/server/learning/comment/data-access/schemas';
import { CommentService } from '@els/server/learning/comment/data-access/services';
import { CommentMutations, CreateCommentInput, ReactCommentInput, ReplyCommentInput } from '@els/server/learning/comment/data-access/types';
import { Auth, AuthGuard, GqlContext, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
import { Args, Context, ResolveField, Resolver } from '@nestjs/graphql';
@Resolver(() => CommentMutations)
export class CommentMutationsResolver {
  constructor(private readonly _commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @ResolveField(() => Comment, { nullable: true})
  create(@Args('CreateCommentInput') createCommentInput: CreateCommentInput, @Auth() identity: Identity, @Context() ctx: GqlContext) {
    //*if is evaluation, clear cache
    if (createCommentInput.category === 'evaluation')
      ctx.cache.delete(`data-caching:${createCommentInput.category}s:${createCommentInput.entityName}:${createCommentInput.entityId}`);
    return this._commentService.create(createCommentInput, identity);
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => Comment, { nullable: true})
  react(@Args('reactCommentInput') reactCommentInput: ReactCommentInput, @Auth() identity: Identity) {
    return this._commentService.react(reactCommentInput, identity);
  }

  @UseGuards(AuthGuard)
  @ResolveField(() => Comment, { nullable: true})
  reply(@Args('replyCommentInput') replyCommentInput: ReplyCommentInput, @Auth() identity: Identity) {
    return this._commentService.reply(replyCommentInput, identity);
  }
}