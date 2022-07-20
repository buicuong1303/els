import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankLog } from '@els/server/learning/rank-log/data-access/entities';
@Module({
  imports: [TypeOrmModule.forFeature([RankLog])],
  controllers: [],
  providers: [],
  exports: [],
})
export class RankLogModule {}
