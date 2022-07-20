/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Module } from '@nestjs/common';
import { PubSubModule } from '@els/server/shared';
import { UserResolver } from './user.resolver';
import { UserService } from '@els/server/notification/user/data-access/services';

@Module({
  imports: [PubSubModule],
  controllers: [],
  providers: [UserService, UserResolver],
  exports: [],
})
export class UserModule {}
