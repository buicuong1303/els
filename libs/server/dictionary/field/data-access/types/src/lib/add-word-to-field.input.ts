import { InputType, Field } from '@nestjs/graphql';
@InputType()
export class AddWordToFieldInput {
  @Field()
  fieldName!: string;

  @Field()
  definitionId!: string;
};
