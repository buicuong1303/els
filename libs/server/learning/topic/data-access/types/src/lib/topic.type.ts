import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'Plain simple topic mutations root object' })
export class TopicMutations {}

@ObjectType({ description: 'Plain simple topic queries root object' })
export class TopicQueries {}

