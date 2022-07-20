/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Comment,
  CommentSchema,
  Attachment,
  AttachmentSchema,
  Reaction,
  ReactionSchema,
  Entity,
  EntitySchema,
} from '@els/server/learning/comment/data-access/schemas';
import { UserModule } from '@els/server/learning/user/feature';
import { CommentResolver } from './comment.resolver';
import { CommentMutationsResolver } from './comment-mutations.resolver';
import { CommentService } from '@els/server/learning/comment/data-access/services';
import { ReactionResolver } from './reaction.resolver';
@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: Attachment.name, schema: AttachmentSchema },
      { name: Reaction.name, schema: ReactionSchema },
      { name: Entity.name, schema: EntitySchema },
    ]),
  ],
  controllers: [],
  providers: [CommentResolver, CommentMutationsResolver, CommentService, ReactionResolver],
  exports: [CommentService],
})
export class CommentModule {}
