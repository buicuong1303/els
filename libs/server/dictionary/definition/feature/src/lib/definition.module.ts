import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { DefinitionService } from '@els/server/dictionary/definition/data-access/services';
import { DefinitionResolver } from './definition.resolver';
import { DefinitionMutationsResolver } from './definition.mutation.resolver';
import { Concept } from '@els/server/dictionary/concept/data-access/entities';
import { Pronunciation } from '@els/server/dictionary/pronunciation/data-access/entities';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { Word } from '@els/server/dictionary/word/data-access/entities';
import { Join } from '@els/server/dictionary/join/data-access/entities';
import { FieldTb } from '@els/server/dictionary/field/data-access/entities';
import { Example } from '@els/server/dictionary/example/data-access/entities';
import { Detail } from '@els/server/dictionary/detail/data-access/entities';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Word, 
      Meaning, 
      Pronunciation, 
      Definition,
      Concept,
      Join,
      FieldTb,
      Example,
      Detail,
      Concept
    ])
  ],
  controllers: [],
  providers: [
    DefinitionService, 
    DefinitionMutationsResolver, 
    DefinitionResolver
  ],
  exports: [DefinitionService],
})
export class DefinitionModule {};
