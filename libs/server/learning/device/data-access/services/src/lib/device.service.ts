/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { AmqpNotificationService } from '@els/server/learning/amqp';
import { Device } from '@els/server/learning/device/data-access/entities';
import {
  CreateDeviceInput, DeleteDeviceInput, UpdateDeviceInput
} from '@els/server/learning/device/data-access/types';
import { User } from '@els/server/learning/user/data-access/entities';
import { exceptions, Identity } from '@els/server/shared';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class DeviceService {
  private readonly _logger = new Logger(DeviceService.name);
  constructor(
    @InjectRepository(Device)
    private readonly _deviceRepository: Repository<Device>,
    private readonly _connection: Connection,
    private readonly _amqpNotificationService: AmqpNotificationService
  ) {}
  async subscribeTokenDevice(
    createDeviceInput: CreateDeviceInput,
    identity: Identity
  ) {
    
    const infoUser = await this._connection.getRepository(User).findOne({
      where: {
        identityId: identity.account?.id,
      },
    });
    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);
    const isExistDevice = await this._deviceRepository.findOne({
      token: createDeviceInput.newToken,
      userId:infoUser.id
    });
    if (isExistDevice) return isExistDevice;
    const newDevice = this._deviceRepository.create();
    newDevice.user = infoUser;
    newDevice.token = createDeviceInput.newToken;
    this._amqpNotificationService.subscribeToTopic({
      tokens: newDevice.token,
      topicName: 'els',
    });
    return this._deviceRepository.save(newDevice);
  }

  async refreshTokenDevice(
    updateDeviceInput: UpdateDeviceInput,
    identity: Identity
  ) { 
    const infoUser = await this._connection.getRepository(User).findOne({
      where: {
        identityId: identity.account?.id,
      },
    });
    if (!infoUser)
      throw new exceptions.NotFoundError('Not found user', this._logger);
    const infoDevice = await this._deviceRepository.findOne({
      token: updateDeviceInput.token,
      userId: infoUser.id,
    });
    if (!infoDevice) {
      return;
    }
    this._amqpNotificationService.subscribeToTopic({
      tokens: infoDevice.token,
      topicName: 'els',
    });
    infoDevice.status = 'active';
    infoDevice.updatedAt = new Date();
    infoDevice.user = infoUser;
    return this._deviceRepository.save(infoDevice);
  }

  async unsubscribeTokenDevice(
    deleteDeviceInput: DeleteDeviceInput,
  ) {
    const infoDevice = await this._deviceRepository.findOne({ 
      token: deleteDeviceInput.token,
    });
    if (!infoDevice) {
      return;
    }
     
    this._amqpNotificationService.unsubscribeToTopic({
      tokens: infoDevice.token,
      topicName: 'els',
    });
    await this._deviceRepository.delete({id: infoDevice.id});
    return 'success';
  }
  async removeTokens(tokens: string[]) {
    console.log(tokens);
  }
}
