import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Plain simple user mutations root object' })
export class UserMutations {}
