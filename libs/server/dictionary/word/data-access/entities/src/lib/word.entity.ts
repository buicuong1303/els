/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field, Directive } from '@nestjs/graphql';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Lang } from '@els/server/dictionary/lang/data-access/entities';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { Contain } from '@els/server/dictionary/contain/data-access/entities';

@Entity()
@Directive('@key(fields: "id")')
@ObjectType({
  implements: () => [BaseType],
})
export class Word extends BaseEntity implements BaseType {
  @Field({nullable: true})
  @Column()
  text!: string;

  @Field(() => Lang, {nullable: true})
  @ManyToOne(() => Lang, (lang) => lang.words)
  lang!: Lang;

  @Field(() => [Meaning], {nullable: true})
  @OneToMany(() => Meaning, (meaning) => meaning.word)
  meanings!: Meaning[];

  @Field(() => [Contain], {nullable: true})
  @OneToMany(() => Contain, (contains) => contains.word)
  contains?: Contain[];
};
