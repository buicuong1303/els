import { registerEnumType } from '@nestjs/graphql';

export enum CategoryComment {
  Comment = 'comment',
  Evaluation = 'evaluation',
}
registerEnumType(CategoryComment, {
  name: 'CategoryComment',
});