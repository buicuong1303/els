import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Concept } from '@els/server/dictionary/concept/data-access/entities';
import { ConceptService } from '@els/server/dictionary/concept/data-access/services';
import { ConceptResolver } from './concept.resolver';
import { ConceptMutationsResolver } from './concept-mutation.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([Concept])],
  controllers: [],
  providers: [ConceptService, ConceptResolver, ConceptMutationsResolver],
  exports: [ConceptService],
})
export class ConceptModule {};
