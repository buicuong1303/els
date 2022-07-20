/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AmqpModule } from '@els/server/learning/amqp';
import { Device } from '@els/server/learning/device/data-access/entities';
import { DeviceService } from '@els/server/learning/device/data-access/services';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeviceMutationsResolver } from './device-mutations.resolver';
import { DeviceResolver } from './device.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([Device]), AmqpModule],
  controllers: [],
  providers: [DeviceService, DeviceResolver, DeviceMutationsResolver],
  exports: [DeviceService],
})
export class DeviceModule {}
