import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class CreateDefinitionInput {
  @Field()
  name!: string;

  @Field()
  explanation!: string;

  @Field()
  meaningId!: string;

  @Field()
  pronunciationId!: string;

  @Field()
  fieldId!: string;
};
