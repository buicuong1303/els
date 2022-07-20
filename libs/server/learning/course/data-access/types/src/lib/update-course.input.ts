import { CreateCourseInput } from './create-course.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCourseInput extends PartialType(CreateCourseInput) {
  @Field()
  id!: string;
}
