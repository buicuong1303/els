/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { ComplexityPlugin, GqlConfigService, typeOrmConfig } from '@els/server/dictionary/common';
import { ConceptModule } from '@els/server/dictionary/concept/feature';
import { ContainModule } from '@els/server/dictionary/contain/feature';
import { DefinitionModule } from '@els/server/dictionary/definition/feature';
import { ExampleModule } from '@els/server/dictionary/example/feature';
import { FieldTbModule } from '@els/server/dictionary/field/feature';
import { DictionaryGrpcModule } from '@els/server/dictionary/grpc';
import { JoinModule } from '@els/server/dictionary/join/feature';
import { LangModule } from '@els/server/dictionary/lang/feature';
import { MeaningModule } from '@els/server/dictionary/meaning/feature';
import { PhraseTranslationModule } from '@els/server/dictionary/phrase-translation/feature';
import { PhraseModule } from '@els/server/dictionary/phrase/feature';
import { PosModule } from '@els/server/dictionary/pos/feature';
import { PronunciationModule } from '@els/server/dictionary/pronunciation/feature';
//* BL module
import { SampleModule } from '@els/server/dictionary/sample/feature';
import { TermModule } from '@els/server/dictionary/term/feature';
import { WordModule } from '@els/server/dictionary/word/feature';
import { SharedServiceModule } from '@els/server/shared';
import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleTranslationModule } from 'libs/server/dictionary/example-translation/feature/src';




//* GraphQL scalars
const graphQLScalars = [
  // JSONScalar,
  // DateScalar,
  // IPv4Scalar,
  // TimeScalar
];

@Module({
  imports: [
    GraphQLFederationModule.forRootAsync({
      imports: [],
      useClass: GqlConfigService,
    }),
    SharedServiceModule,
    TypeOrmModule.forRootAsync(typeOrmConfig),
    //TODO: still Redis, Bull, TypeORM, Prometheus, Shared...

    // feature
    SampleModule,
    LangModule,
    WordModule,
    PhraseModule,
    MeaningModule,
    PosModule,
    ConceptModule,
    DefinitionModule,
    ExampleModule,
    FieldTbModule,
    JoinModule,
    PronunciationModule,
    TermModule,
    PhraseTranslationModule,
    ContainModule,
    ExampleTranslationModule,
    DictionaryGrpcModule,
  ],
  controllers: [],
  providers: [
    ComplexityPlugin,

    /**
     * current use graphql shield to replace this
     */
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpErrorFilter,
    // },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: LoggingInterceptor,
    // },
    ...graphQLScalars,
  ],
})
export class CoreModule {}
