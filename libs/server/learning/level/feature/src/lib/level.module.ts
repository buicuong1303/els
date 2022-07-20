import { Module } from '@nestjs/common';
import { LevelMutationsResolver } from './level-mutations.resolver';
import { LevelResolver } from './level.resolver';
import { LevelService } from '@els/server/learning/level/data-access/services';
import { Level } from '@els/server/learning/level/data-access/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ TypeOrmModule.forFeature([Level])],
  controllers: [],
  providers: [
    LevelMutationsResolver,
    LevelResolver,
    LevelService
  ],
  exports: [LevelService],
})
export class LevelModule {}
