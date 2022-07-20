import { InvitationMutations, InvitationQueries } from '@els/server/learning/invitation/data-access/types';
import { User } from '@els/server/learning/user/data-access/entities';
import { Mutation, Resolver, Query } from '@nestjs/graphql';
import 'reflect-metadata';
@Resolver(() => User)
export class InvitationResolver {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
  }
  
  @Mutation(() => InvitationMutations, {
    nullable: true,
    description: 'Root mutation for all accounts related mutations',
    name: 'invitation',
  })
  async invitationMutations() {
    return {};
  }

  @Query(() => InvitationQueries, {
    nullable: true,
    description: 'Root query for all accounts related queries',
    name: 'invitation',
  })
  invitationQueries() {
    return {};
  }
}
