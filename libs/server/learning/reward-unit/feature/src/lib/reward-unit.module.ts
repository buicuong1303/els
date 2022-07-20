import { Module } from '@nestjs/common';
import { RewardUnitService } from '@els/server/learning/reward-unit/data-access/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardUnit } from '@els/server/learning/reward-unit/data-access/entities';
@Module({
  imports: [TypeOrmModule.forFeature([RewardUnit])],
  controllers: [],
  providers: [RewardUnitService],
  exports: [RewardUnitService],
})
export class RewardUnitModule {}
