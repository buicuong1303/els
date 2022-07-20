/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from '@els/server/learning/enrollment/data-access/entities';
import {
  EnrollmentService,
} from '@els/server/learning/enrollment/data-access/services';
import { EnrollmentMutationsResolver } from './enrollment-mutation.resolver';
import { EnrollmentResolver } from './enrollment.resolver';
import { UserModule } from '@els/server/learning/user/feature';
import { AmqpModule } from '@els/server/learning/amqp';
import { MissionQueueModule } from '@els/server/learning/queues';
@Module({
  imports: [
    TypeOrmModule.forFeature([Enrollment]),
    forwardRef(() => UserModule),
    forwardRef(() => AmqpModule ),
    MissionQueueModule
  ],
  controllers: [],
  providers: [
    EnrollmentResolver,
    EnrollmentMutationsResolver,
    EnrollmentService,
  ],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}
