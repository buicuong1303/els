import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateExampleInput {
  @Field()
  sentence!: string;

  @Field({nullable: true})
  definitionId?: string;

  @Field({nullable: true})
  phraseId?: string;

};
