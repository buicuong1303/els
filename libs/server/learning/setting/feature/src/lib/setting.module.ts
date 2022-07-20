import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Setting } from '@els/server/learning/setting/data-access/entities';
import { SettingService } from '@els/server/learning/setting/data-access/services';
import { SettingResolver } from './setting.resolver';
import { SettingMutationsResolver } from './setting-mutation.resolver';
import { MissionTarget } from '@els/server/learning/user/data-access/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Setting]), 
    TypeOrmModule.forFeature([MissionTarget]), 
  ],
  controllers: [],
  providers: [SettingService, SettingMutationsResolver, SettingResolver],
  exports: [SettingService],
})
export class SettingModule {}
