import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankType } from '@els/server/learning/rank-type/data-access/entities';
@Module({
  imports: [TypeOrmModule.forFeature([RankType])],
  controllers: [],
  providers: [],
  exports: [],
})
export class RankTypeModule {}
