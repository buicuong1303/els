import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Term } from '@els/server/dictionary/term/data-access/entities';
import { TermService } from '@els/server/dictionary/term/data-access/services';
import { TermResolver } from './term.resolver';
@Module({
  imports: [TypeOrmModule.forFeature([Term])],
  controllers: [],
  providers: [
    TermService,
    TermResolver
  ],
  exports: [TermService],
})
export class TermModule {}
