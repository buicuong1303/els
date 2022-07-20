import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pos } from '@els/server/dictionary/pos/data-access/entities';
import { PosService } from '@els/server/dictionary/pos/data-access/services';
import { PosResolver } from './pos.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([Pos])],
  controllers: [],
  providers: [PosService, PosResolver],
  exports: [PosService],
})
export class PosModule {}
