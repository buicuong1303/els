/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Pronunciation extends BaseEntity implements BaseType {
  @Field()
  @Column()
  phonetic?: string;

  @Field({nullable: true})
  @Column({nullable: true})
  audioUri?: string;

  @Field(() => [Definition])
  @OneToMany(() => Definition, (definition) => definition.pronunciation)
  definitions!: Definition[];
};
