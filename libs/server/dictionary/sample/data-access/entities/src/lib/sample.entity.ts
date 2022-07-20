import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Sample extends BaseEntity implements BaseType {
  @Field()
  @Column()
  name!: string;
};
