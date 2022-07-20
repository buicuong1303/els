/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { CategoryComment } from '@els/server/learning/common';
import { User } from '@els/server/learning/user/data-access/entities';
import { JSONType } from '@els/server/shared';
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import * as mongoose from 'mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Entity, Reaction } from '..';
export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Comment {
  @Field(() => String)
  @Transform(({ value }) => value.toString())
  _id!: MongooseSchema.Types.ObjectId;

  @Field({ nullable: true })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  parentId?: string;

  @Field()
  @Prop()
  text?: string;

  @Field(()=> CategoryComment)
  @Prop({ default: 'comment' })
  category?: string;

  @Field()
  @Prop({ default: 0 })
  rating?: number;

  @Field(() => Entity)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Entity' })
  entity!: Entity;

  @Field()
  @Prop({ required: true })
  userId!: string;

  @Field(() => [JSONType])
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        //* auto populate foreign key
        autopopulate: true,
      },
    ],
  })
  children?: JSONType[];

  @Field()
  user!: User;

  @Field(() => [Reaction])
  @Prop({
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction',
        autopopulate: true,
      },
    ],
  })
  reactions!: Reaction[];

  // @Field(() => [Reaction], { nullable: true })
  // reactions!: Reaction[];

  @Field()
  @Prop({ default: 0 })
  reactionCount!: number;

  @Field()
  @Prop({ type: Date })
  createdAt!: Date;

  @Field()
  @Prop({ type: Date })
  updatedAt!: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment).plugin(
  require('mongoose-autopopulate')
);
