import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Meaning } from '@els/server/dictionary/meaning/data-access/entities';
import { MeaningService } from '@els/server/dictionary/meaning/data-access/services';
import { Pos } from '@els/server/dictionary/pos/data-access/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeaningResolver } from './meaning.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([
    Meaning,
    Pos,
    Definition
  ])
  ],
  controllers: [],
  providers: [MeaningService, MeaningResolver],
  exports: [MeaningService],
})
export class MeaningModule {};
