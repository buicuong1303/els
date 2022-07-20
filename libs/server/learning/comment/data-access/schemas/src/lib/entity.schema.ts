import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

export type EntityDocument = Entity & Document;

@Schema({ timestamps: true })
@ObjectType()
export class Entity {
  @Transform(({ value }) => value.toString())
  _id!: ObjectId;

  @Field()
  @Prop({ required: true })
  entityId?: string;

  @Field()
  @Prop({ required: true })
  entityName?: string;
  
  @Field()
  createdAt!: string;

  @Field()
  updatedAt!: string;
}

export const EntitySchema = SchemaFactory.createForClass(Entity);
