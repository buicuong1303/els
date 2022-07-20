import { InputType, Field } from '@nestjs/graphql';
import { IPv4Type } from '@els/server/shared';

@InputType()
export class CreateCourseInput {
  @Field()
  name!: string;

  @Field(() => IPv4Type, { nullable: true })
  ipv4?: IPv4Type;
}
