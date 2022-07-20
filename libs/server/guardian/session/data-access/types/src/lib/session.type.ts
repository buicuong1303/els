import { ObjectType } from '@nestjs/graphql';
import { Field } from '@nestjs/graphql';

@ObjectType({ description: 'Plain simple session queries root object' })
export class SessionQueries {}

@ObjectType({ description: 'Plain simple session mutations root object' })
export class SessionMutations {}

@ObjectType()
export class Session {
  @Field({
    description: 'This is the jwt token of the account',
    nullable: true,
  })
  idToken?: string;
}
