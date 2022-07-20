import {
  Field,
  ObjectType,
} from '@nestjs/graphql';
@ObjectType()
export class DeleteMany {
  @Field(() => Number)
  affected!: number;
}
