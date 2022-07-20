import {
  Field,
  HideField,
  ID,
  InterfaceType,
} from '@nestjs/graphql';
@InterfaceType()
export abstract class BaseType {
  @Field((type) => ID, { description: 'Id' })
  id!: string;

  @Field()
  createdBy?: string;

  @Field()
  createdAt!: Date;

  @HideField()
  updatedBy?: string;

  @HideField()
  updatedAt!: Date;

  @HideField()
  deletedAt?: Date;
}
