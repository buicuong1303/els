import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Plain simple notification mutations root object' })
export class NotificationMutations {}
@ObjectType()
export class NotificationData {
  @Field()
  id!: string;

  @Field()
  actor!: string;

  @Field()
  code!: string;

  @Field()
  message!: string;

  @Field()
  link?: string;

  @Field()
  status!: string;

  @Field()
  createdAt!: Date;
}