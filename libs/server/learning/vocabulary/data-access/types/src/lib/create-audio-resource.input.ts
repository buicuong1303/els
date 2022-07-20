import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class CreateAudioResourceInput {

  @Field() 
  transcript!: string;
  
  @Field({ nullable: true }) 
  uri?: string;

  @Field(() => Boolean)
  isWord!: boolean;

}
