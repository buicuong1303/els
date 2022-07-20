import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({ description: 'Email response' })
export class EmailResponse {
  @Field()
  subject!: string;

  @Field()
  body!: string;
}
