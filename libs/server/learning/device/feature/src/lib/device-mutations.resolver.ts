/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Args, ResolveField, Resolver } from '@nestjs/graphql';
import { Device } from '@els/server/learning/device/data-access/entities';
import {
  DeviceMutations,
  CreateDeviceInput,
  UpdateDeviceInput,
  DeleteDeviceInput,
} from '@els/server/learning/device/data-access/types';
import { DeviceService } from '@els/server/learning/device/data-access/services';
import { Auth, AuthGuard, Identity } from '@els/server/shared';
import { UseGuards } from '@nestjs/common';
@Resolver(() => DeviceMutations)
export class DeviceMutationsResolver {
  constructor(private readonly _deviceService: DeviceService) {}

  @ResolveField(() => Device)
  @UseGuards(AuthGuard)
  create(
  @Args('createDeviceInput') createDeviceInput: CreateDeviceInput,
    @Auth() identity: Identity
  ) {
    return this._deviceService.subscribeTokenDevice(createDeviceInput, identity);
  }
  @ResolveField(() => Device, { nullable: true })
  @UseGuards(AuthGuard)
  update(
  @Args('updateDeviceInput') updateDeviceInput: UpdateDeviceInput,
    @Auth() identity: Identity
  ) {
    return this._deviceService.refreshTokenDevice(updateDeviceInput, identity);
  }
  @ResolveField(() => String, { nullable: true })
  delete(
  @Args('deleteDeviceInput')
    deleteDeviceInput: DeleteDeviceInput,
  ) {
    return this._deviceService.unsubscribeTokenDevice(
      deleteDeviceInput,
    );
  }
}
