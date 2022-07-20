import { Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AttachmentDocument = Attachment & Document;

@Schema({ timestamps: true })
export class Attachment {
  @Field(() => String)
  @Transform(({ value }) => value.toString())
  _id!: MongooseSchema.Types.ObjectId;

  @Field()
  @Prop()
  name?: string;

  @Field()
  @Prop({ required: true })
  category!: string;

  @Field()
  @Prop({ required: true })
  uri!: string;

  @Field()
  createdAt!: string;

  @Field()
  updatedAt!: string;

}

export const AttachmentSchema = SchemaFactory.createForClass(Attachment);
