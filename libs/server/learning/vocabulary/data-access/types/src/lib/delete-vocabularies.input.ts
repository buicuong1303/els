import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class DeleteVocabulariesInput  {
  @Field(() => [String])
  ids!: string[];

}
