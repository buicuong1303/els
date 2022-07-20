import { Resolver, ResolveField } from '@nestjs/graphql';
import { SampleMutations } from '@els/server/dictionary/sample/data-access/types'
import { Sample } from '@els/server/dictionary/sample/data-access/entities';
import { SampleService } from '@els/server/dictionary/sample/data-access/services'

@Resolver(() => SampleMutations)
export class SampleMutationsResolver {
  constructor(private readonly _sampleService: SampleService) {};

  @ResolveField(() => Sample)
  create(): Sample {
    return null;
  };

  @ResolveField(() => Sample)
  update(): Sample {
    return null;
  };

  @ResolveField(() => Sample)
  delete(): Sample {
    return null;
  };
};
