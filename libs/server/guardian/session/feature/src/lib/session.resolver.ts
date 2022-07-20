import { SessionMutations, SessionQueries } from '@els/server-guardian-session-data-access-types';
import { Mutation, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class SessionResolver {
  @Mutation(() => SessionMutations, {
    nullable: true,
    description: 'Root mutation for all sessions related mutations',
    name: 'session',
  })
  async sessionMutations() {
    return {};
  }

  @Query(() => SessionQueries, {
    nullable: true,
    description: 'Root query for all sessions related queries',
    name: 'session',
  })
  sessionQueries() {
    return {};
  }
}
