/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class FieldTb extends BaseEntity implements BaseType {
  @Field()
  @Column()
  description?: string;

  @Field()
  @Column()
  name!: string;

  @Field(() => [Definition], {nullable: true})
  @OneToMany(() => Definition, (definition) => definition.fieldTb)
  definitions?: Definition[];
};
