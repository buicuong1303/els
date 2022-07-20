/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Pos extends BaseEntity implements BaseType {
  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  description?: string;

  @Field(() => [Meaning])
  @OneToMany(() => Meaning, (meaning) => meaning.pos)
  meanings!: Meaning[];
};
