import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wordbook } from '@els/server/learning/wordbook/data-access/entities';
import { WordbookService } from '@els/server/learning/wordbook/data-access/services'
import { WordbookMutationsResolver } from './wordbook-mutation.resolver';
import { WorkbookResolver } from './wordbook.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([Wordbook])],
  controllers: [],
  providers: [WordbookMutationsResolver, WorkbookResolver, WordbookService ],
  exports: [WordbookService],
})
export class WordbookModule {}
