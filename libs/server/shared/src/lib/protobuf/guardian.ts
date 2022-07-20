import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Metadata } from 'grpc';
import { GuardianGrpcServiceClient } from '../services';
export interface AuthenticateRequest {
  sessionToken?: string;
  sessionCookie?: string;
}

export interface AuthenticateResponse {
  id: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  username?: string;
  email: string;
  phone? : string;
  picture?: string;
}

export interface GetIdentityRequest {
  id: string;
}

export interface GetIdentityResponse {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  picture?: string;
}

export interface GetIdentitiesResponse {
  identities: GetIdentityResponse[];
};
export interface GuardianServiceClient {
  authenticate(
    request: AuthenticateRequest,
    metadata?: Metadata,
    ...rest: any
  ): Observable<AuthenticateResponse>;
  getIdentity(
    request: GetIdentityRequest,
    metadata?: Metadata,
    ...rest: any
  ): Observable<GetIdentityResponse>;
  getIdentities(
    metadata?: Metadata,
    ...rest: any
  ): Observable<GetIdentitiesResponse>;
}

export interface GuardianServiceController {
  authenticate(
    request: AuthenticateRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<AuthenticateResponse> | Promise<AuthenticateResponse> | AuthenticateResponse

  getIdentity(
    request: GetIdentityRequest,
    metadata?: Metadata,
    ...rest: any
  ): Observable<GetIdentityResponse> | Promise<GetIdentityResponse> | GetIdentityResponse

  getIdentities(
    metadata?: Metadata,
    ...rest: any
  ): Observable<GetIdentitiesResponse> | Promise<GetIdentitiesResponse> | GetIdentitiesResponse
}

export function GuardianServiceControllerMethods() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (constructor: Function) {
    const grpcMethods: string[] = ['authenticate', 'getIdentity', 'getIdentities'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );

      GrpcMethod(GuardianGrpcServiceClient.GetConfig().service, method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }

    const grpcStreamMethods: string[] = [];
    if (grpcStreamMethods.length > 0) {
      for (const method of grpcStreamMethods) {
        const descriptor: any = Reflect.getOwnPropertyDescriptor(
          constructor.prototype,
          method
        );

        GrpcStreamMethod(GuardianGrpcServiceClient.GetConfig().service, method)(
          constructor.prototype[method],
          method,
          descriptor
        );
      }
    }
  };
}
