import { PhraseTranslation } from '@els/server/dictionary/phrase-translation/data-access/entities';
import { PhraseTranslationService } from '@els/server/dictionary/phrase-translation/data-access/services';
import { Phrase } from '@els/server/dictionary/phrase/data-access/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
@Module({
  imports: [TypeOrmModule.forFeature([PhraseTranslation, Phrase])],
  controllers: [],
  providers: [PhraseTranslationService],
  exports: [PhraseTranslationService],
})
export class PhraseTranslationModule {};
