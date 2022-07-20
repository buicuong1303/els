/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import { Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { Pos } from '@els/server/dictionary/pos/data-access/entities';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class Meaning extends BaseEntity implements BaseType {
  @Field(() => Word, {nullable: true})
  @ManyToOne(() => Word, (word) => word.meanings)
  word!: Word;

  @Field(() => Pos, {nullable: true})
  @ManyToOne(() => Pos, (pos) => pos.meanings)
  pos?: Pos;


  @Field(() => [Definition])
  @OneToMany(() => Definition, (definition) => definition.meaning)
  definitions!: Definition[];
};
