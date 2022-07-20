import { Module } from '@nestjs/common';
import { LanguageService } from '@els/server/learning/language/data-access/services';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [
    LanguageService
  ],
  exports: [LanguageService],
})
export class LanguageModule {}
