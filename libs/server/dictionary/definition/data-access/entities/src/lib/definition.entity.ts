/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Join } from '@els/server/dictionary/join/data-access/entities';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { FieldTb } from '@els/server/dictionary/field/data-access/entities';
import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { Detail } from '@els/server/dictionary/detail/data-access/entities';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Definition extends BaseEntity implements BaseType {
  @Field({nullable: true})
  @Column({default: ''})
  explanation?: string;

  @Field({nullable: true})
  @Column({default: ''})
  description?: string;

  @Field(() => [Join])
  @OneToMany(() => Join, (join) => join.definition)
  joins!: Join[];

  @Field(() => [Example])
  @OneToMany(() => Example, (example) => example.definition)
  examples!: Example[];

  @Field(() => Meaning)
  @ManyToOne(() => Meaning, (meaning) => meaning.definitions)
  meaning!: Meaning;

  @Field(() => FieldTb, {nullable: true})
  @ManyToOne(() => FieldTb, (fieldTb) => fieldTb.definitions)
  fieldTb?: FieldTb;

  @Field(() => Pronunciation)
  @ManyToOne(() => Pronunciation, (pronunciation) => pronunciation.definitions)
  pronunciation!: Pronunciation;

  @Field(() => Detail, {nullable: true})
  @OneToOne(() => Detail)
  @JoinColumn()
  detail?: Detail;
};
