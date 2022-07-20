/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Comment } from '..';
import * as mongoose from 'mongoose';
import { Transform } from 'class-transformer';
import { User } from '@els/server/learning/user/data-access/entities';

export type ReactionDocument = Reaction & Document;
@Schema({ timestamps: true })
@ObjectType()
export class Reaction {
  @Field(() => String)
  @Transform(({ value }) => value.toString())
  _id!: mongoose.Schema.Types.ObjectId;

  @Field(() => String)
  @Prop({ required: true})
  emoji?: string;

  @Field(() => Comment)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  comment!: Comment;

  @Field()
  @Prop({ required: true })
  userId!: string;

  @Field()
  user!: User;

  @Field()
  createdAt!: string;

  @Field()
  updatedAt!: string;
}

export const ReactionSchema = SchemaFactory.createForClass(Reaction);