import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lang } from '@els/server/dictionary/lang/data-access/entities';
import { LangService } from '@els/server/dictionary/lang/data-access/services';
import { Word } from '@els/server/dictionary/word/data-access/entities';
@Module({
  imports: [TypeOrmModule.forFeature([Lang, Word])],
  controllers: [],
  providers: [LangService],
  exports: [LangService],
})
export class LangModule {};
