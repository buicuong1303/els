import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class AccountIdentity {
  @Field((type) => ID)
  @Directive('@external')
  id?: string;

  @Field((type) => User, { nullable: true })
  user?: User;
}
