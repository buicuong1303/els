import { Device } from '@els/server/learning/device/data-access/entities';
import { DeviceService } from '@els/server/learning/device/data-access/services';
import { DeviceMutations } from '@els/server/learning/device/data-access/types';
import { Mutation, Query, Resolver } from '@nestjs/graphql';
@Resolver(() => Device)
export class DeviceResolver {
  constructor(private readonly _deviceService: DeviceService) {}

  @Mutation(() => DeviceMutations, { nullable: true, name: 'device' })
  deviceMutations() {
    return {};
  }

  @Query(() => String, { nullable: true })
  getDevice() {
    return '';
  }
}
