/* eslint-disable @typescript-eslint/no-unused-vars */
import { PronunciationService } from '@els/server/dictionary/pronunciation/data-access/services';
import { WordService } from '@els/server/dictionary/word/data-access/services';
import { protobuf } from '@els/server/shared';
import { Controller, Logger } from '@nestjs/common';
import { Metadata } from 'grpc';
@protobuf.DICTIONARY.DictionaryServiceControllerMethods()
@Controller()
export class DictionaryGrpcService
implements protobuf.DICTIONARY.DictionaryServiceController {
  private readonly _logger = new Logger(DictionaryGrpcService.name);

  constructor(
    private readonly _wordService: WordService, //
    private readonly _pronunciationService: PronunciationService //
  ) {}

  //* Reference với Learning để lấy phát âm của từ
  async getReference(
    request: protobuf.DICTIONARY.GetReferenceRequest,
    metadata: Metadata,
    ...rest: any
  ): Promise<protobuf.DICTIONARY.GetReferenceResponse> {

    const pronunciationData = await this._pronunciationService.getPhonetic(request.vocabulary, request.langCode, request.pos );
    return {
      phonetic: pronunciationData.pronunciation[0]?.phonetic || '',
      audioUri: pronunciationData.pronunciation[0]?.audioUri || '',
      referenceId: pronunciationData.word?.id || '',
      type: pronunciationData.type,
    };
  }
}
