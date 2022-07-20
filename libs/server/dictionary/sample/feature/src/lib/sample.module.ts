import { Module } from '@nestjs/common';
import { SampleResolver } from './sample.resolver';
import { SampleMutationsResolver } from './sample-mutations.resolver';
import { SampleService } from '@els/server/dictionary/sample/data-access/services';

@Module({
  controllers: [],
  providers: [SampleResolver, SampleMutationsResolver, SampleService],
  exports: [],
})
export class SampleModule {};
