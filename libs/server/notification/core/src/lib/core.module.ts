/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { FirebaseModule } from '@els/server/notification/firebase/feature';
import { AmqpModule } from '@els/server/notification/amqp';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfigService } from '@els/server/notification/common';
import { SharedServiceModule } from '@els/server/shared';
import { UserModule } from '@els/server/notification/user/feature';
import { StreakModule } from '@els/server/notification/streak/feature';
import { MissionModule } from '@els/server/notification/mission/feature';
@Module({
  imports: [
    FirebaseModule,
    AmqpModule,
    GraphQLModule.forRootAsync({
      // debug: true,
      // path: join(process.cwd(), 'gql-schema/graphql-subscription.gql'),
      useClass: GqlConfigService,
    }),
    SharedServiceModule,
    UserModule,
    StreakModule,
    MissionModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule {}
