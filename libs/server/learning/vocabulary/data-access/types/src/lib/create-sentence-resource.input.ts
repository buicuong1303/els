import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateSentenceResourceInput {
  
  @Field() 
  sentence!: string;

  @Field() 
  translation!: string;
  

}
