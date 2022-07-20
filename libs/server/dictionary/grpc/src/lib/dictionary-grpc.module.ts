import { Module } from '@nestjs/common';
import { WordModule } from '@els/server/dictionary/word/feature';
import { PronunciationModule } from '@els/server/dictionary/pronunciation/feature';
import { DictionaryGrpcService } from './dictionary-grpc.service';


@Module({
  imports: [WordModule, PronunciationModule],
  controllers: [DictionaryGrpcService]
})
export class DictionaryGrpcModule {};
