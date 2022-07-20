import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Plain simple course mutations root object' })
export class CourseMutations {}

//*  using for test parent -> children
@ObjectType()
export class Section {
  @Field({ description: 'Id' })
  id!: string;

  @Field()
  name!: string;

  @Field()
  courseId!: string;
}

/**
 * * only using for IMPLEMENT resource
 * * cannot using for CRUD resource because that is hard when find @Parent
 */
@ObjectType({ description: 'Plain simple course queries root object' })
export class CourseQueries {}
