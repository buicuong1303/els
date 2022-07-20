/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AccountModule } from '@els/server-guardian-account-feature';
import { FormModule } from '@els/server-guardian-form-feature';
import { SessionModule } from '@els/server-guardian-session-feature';
import { GqlConfigService, KratosModule, typeOrmConfig } from '@els/server/guardian/common';
import { GuardianGrpcModule } from '@els/server/guardian/grpc';
import { SharedServiceModule } from '@els/server/shared';
import { Module } from '@nestjs/common';
import { GraphQLFederationModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    GraphQLFederationModule.forRootAsync({
      imports: [],
      useClass: GqlConfigService,
    }),
    KratosModule,
    AccountModule,
    SessionModule,
    FormModule,
    TypeOrmModule.forRootAsync(typeOrmConfig),
    GuardianGrpcModule,
    SharedServiceModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})

export class CoreModule {};

