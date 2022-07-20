import {
  Resolver,
  Query,
  Mutation,
} from '@nestjs/graphql';
import { SampleMutations } from '@els/server/dictionary/sample/data-access/types';
import { Sample } from '@els/server/dictionary/sample/data-access/entities';

@Resolver(() => Sample)
export class SampleResolver {
  @Mutation(() => SampleMutations, {
    nullable: true,
    description: 'Root mutation for all samples related mutations',
    name: 'sample',
  })
  sampleMutations() {
    return {};
  };

  @Query(() => [Sample])
  samples(): Sample[] {
    return [];
  };
};
