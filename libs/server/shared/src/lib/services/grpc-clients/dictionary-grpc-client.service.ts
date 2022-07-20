import { Injectable, InternalServerErrorException, OnModuleInit, Logger } from '@nestjs/common';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { Metadata } from 'grpc';
import { join } from 'path';
import { DICTIONARY } from '../../..';
import * as api from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { lastValueFrom } from 'rxjs';
import { extractBooleanEnvVar } from '@els/shared/utils';
const baseUrl = 'libs/server/shared/src/lib/protobuf';
const conf = {
  package: 'els.srv.dictionary',
  service: 'DictionaryService',
  protoPath: join(process.cwd(), `${baseUrl}`, 'dictionary.proto'),
  url: `0.0.0.0:${process.env.GRPC_PORT}`, //* inside url for grpc server
  clientUrl: `${process.env.GRPC_DICTIONARY_HOST}:${process.env.GRPC_PORT}` //* outside url for another service can connect
};

@Injectable()
export class DictionaryGrpcServiceClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: conf.clientUrl,
      package: conf.package, //* proto package name define in proto file
      protoPath: conf.protoPath, //* dir to proto file,
    },
  })
  private readonly _client!: ClientGrpc;
  private readonly _logger = new Logger(DictionaryGrpcServiceClient.name);

  private _svc!: DICTIONARY.DictionaryServiceClient;

  onModuleInit() {
    //* service name define in proto file
    this._svc = this._client.getService<DICTIONARY.DictionaryServiceClient>(conf.service);
  }

  public static GetConfig() {
    return conf;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getReference(request: DICTIONARY.GetReferenceRequest, metadata?: Metadata, ...rest: any): Promise<DICTIONARY.GetReferenceResponse> {
    if (extractBooleanEnvVar('ENABLE_TRACING'))  {
      const tracer = api.trace.getTracer('default');
      const span = tracer.startSpan('els.srv.dictionary.DictionaryService/GetReference', {
        attributes: {
          [SemanticAttributes.RPC_METHOD]: 'GetReference',
        },
        kind: SpanKind.CLIENT
      });

      try {
        const reference: DICTIONARY.GetReferenceResponse = await lastValueFrom(this._svc.getReference(request));
        span.setAttribute(SemanticAttributes.RPC_GRPC_STATUS_CODE, SpanStatusCode.OK);
        return reference;
      } catch (error) {
        span.setAttribute(SemanticAttributes.RPC_GRPC_STATUS_CODE, SpanStatusCode.ERROR);
        this._logger.error(error);
        throw new InternalServerErrorException('Can not get identity');
      } finally {
        span.end();
      }
    } else {
      try {
        const reference: DICTIONARY.GetReferenceResponse = await lastValueFrom(this._svc.getReference(request));
        return reference;
      } catch (error) {
        this._logger.error(error);
        throw new InternalServerErrorException('Can not get identity');
      }
    }

  }
}
