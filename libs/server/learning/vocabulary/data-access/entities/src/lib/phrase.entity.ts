import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { Vocabulary } from './vocabulary.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Phrase {
  @Field(() => ID)
  @Directive('@external')
  id?: string;

  @Field(() => Vocabulary)
  vocabulary?: Vocabulary;
}
