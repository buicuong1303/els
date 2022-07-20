import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class CreateVideoResourceInput {

  @Field() 
  transcript!: string;
  
  @Field() 
  uri!: string;

}
