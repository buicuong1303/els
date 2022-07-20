import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Plain simple account mutations root object' })
export class InvitationMutations {}

@ObjectType({ description: 'Plain simple account queries root object' })
export class InvitationQueries {}


