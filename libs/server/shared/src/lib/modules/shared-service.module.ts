import { Global, Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DictionaryGrpcServiceClient, GuardianGrpcServiceClient, LearningGrpcServiceClient, TextToSpeechService, MinIoService } from '../services';

@Global()
@Module({
  imports: [CqrsModule],
  providers: [
    GuardianGrpcServiceClient,
    DictionaryGrpcServiceClient,
    LearningGrpcServiceClient,
    TextToSpeechService,
    MinIoService
  ],
  exports: [
    CqrsModule,
    GuardianGrpcServiceClient,
    DictionaryGrpcServiceClient,
    LearningGrpcServiceClient,
    TextToSpeechService,
    MinIoService
  ],
})
export class SharedServiceModule {}
