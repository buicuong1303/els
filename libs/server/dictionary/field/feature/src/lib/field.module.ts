import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FieldTb } from '@els/server/dictionary/field/data-access/entities';
import { FieldTbService } from '@els/server/dictionary/field/data-access/services';
import { FieldTbResolver } from './field.resolver';
import { FieldTbMutationsResolver } from './field-mutation.resolver';
import { Definition } from '@els/server/dictionary/definition/data-access/entities';
import { Word } from '@els/server/dictionary/word/data-access/entities';
@Module({
  imports: [TypeOrmModule.forFeature([
    FieldTb, 
    Definition,
    Word
  ])],
  controllers: [],
  providers: [FieldTbService, FieldTbResolver, FieldTbMutationsResolver],
  exports: [FieldTbService],
})
export class FieldTbModule {}
