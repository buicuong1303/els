import { CronMutations } from '@els/server/learning/cron/data-access/types';
import {
  Mutation, Resolver
} from '@nestjs/graphql';
@Resolver()
export class CronResolver {

  @Mutation(() => CronMutations, {
    nullable: true,
    description: 'Root mutation for all cron related comments',
    name: 'cron',
  })
  cronMutations() {
    return {};
  }

}
