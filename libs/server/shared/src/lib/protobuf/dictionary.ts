import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Metadata } from 'grpc';
import { DictionaryGrpcServiceClient } from '../services';
export interface GetIdentityRequest {
  identityId: string;
}
export interface GetReferenceRequest {
  vocabulary: string;
  langCode: string;
  pos: string
}


export interface GetReferenceResponse {
  referenceId: string;
  phonetic: string;
  audioUri: string;
  type: string;
}

export interface DictionaryServiceClient {
  getReference(
    request: GetReferenceRequest,
    metadata?: Metadata,
    ...rest: any
  ): Observable<GetReferenceResponse>
}

export interface DictionaryServiceController {
  getReference(
    request: GetReferenceRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<GetReferenceResponse> | Promise<GetReferenceResponse> | GetReferenceResponse
}

export function DictionaryServiceControllerMethods() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'getReference'
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );

      GrpcMethod(DictionaryGrpcServiceClient.GetConfig().service, method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }

    const grpcStreamMethods: string[] = [];
    if (grpcStreamMethods.length > 0) {
      for (const method of grpcStreamMethods) {
        const descriptor: any = Reflect.getOwnPropertyDescriptor(
          constructor.prototype,
          method,
        );
        GrpcStreamMethod(DictionaryGrpcServiceClient.GetConfig().service, method)(
          constructor.prototype[method],
          method,
          descriptor,
        );
      }
    }

  };
}
