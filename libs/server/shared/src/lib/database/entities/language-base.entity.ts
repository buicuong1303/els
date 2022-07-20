/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Field, InterfaceType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { BaseType } from '../../graphql';
import { BaseEntity } from './base.entity';
@Entity()
@InterfaceType()
@TableInheritance({ column: { type: 'varchar', name: 'type', nullable: true } })
export class BaseLang extends BaseEntity implements BaseType {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Field()
  @Column()
  name!: string;

  @Field()
  @Column()
  code!: string;

}
