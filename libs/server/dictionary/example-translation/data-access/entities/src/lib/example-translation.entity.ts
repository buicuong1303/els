/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ObjectType, Field } from '@nestjs/graphql';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity, BaseType } from '@els/server/shared';
import { Example } from '@els/server/dictionary/example/data-access/entities';

@Entity()
@ObjectType({
  implements: () => [BaseType],
})
export class ExampleTranslation extends BaseEntity implements BaseType {
  @Field()
  @Column()
  text!: string;

  @Field()
  @Column()
  lang!: string;

  @Field(() => Example, {nullable: true})
  @ManyToOne(() => Example, (example) => example.exampleTranslations)
  example!: Example;
};
