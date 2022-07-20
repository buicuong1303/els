import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Plain simple account mutations root object' })
export class AccountIdentityMutations {}

@ObjectType({ description: 'Plain simple account queries root object' })
export class AccountIdentityQueries {}


