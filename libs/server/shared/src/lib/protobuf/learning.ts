import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { Metadata } from 'grpc';
import { LearningGrpcServiceClient } from '../services';
export interface CreateUserRequest {
  identityId: string;
  userInvitedId?: string;
}

export interface CreateUserResponse {
  userId: string;
}

export interface UpdateUserRequest {
  userId: string;
}

export interface UpdateUserResponse {
  id: string;
  exp: number;
}

export interface LearningServiceClient {
  createUser(
    request: CreateUserRequest,
    metadata?: Metadata,
    ...rest: any
  ): Observable<CreateUserResponse>,
  updateRank(
    request: any,
    metadata?: Metadata,
    ...rest: any
  ): Observable<any>,
  updateUser(
    request: UpdateUserRequest,
    metadata?: Metadata,
    ...rest: any
  ): Observable<UpdateUserResponse>
}

export interface LearningServiceController {
  createUser(
    request: CreateUserRequest,
    metadata: Metadata,
    ...rest: any
  ): Observable<CreateUserResponse> | Promise<CreateUserResponse> | CreateUserResponse

  updateRank(
    request: any,
    metadata: Metadata,
    ...rest: any
  ): Observable<any> | Promise<any> | any

  updateUser(
    request: UpdateUserRequest,
    metadata?: Metadata,
    ...rest: any
  ): Observable<UpdateUserResponse> | Promise<UpdateUserResponse> | UpdateUserResponse
}

export function LearningServiceControllerMethods() {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (constructor: Function) {
    const grpcMethods: string[] = [
      'createUser',
      'updateRank',
      'updateUser'
    ];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );

      GrpcMethod(LearningGrpcServiceClient.GetConfig().service, method)(
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
        GrpcStreamMethod(LearningGrpcServiceClient.GetConfig().service, method)(
          constructor.prototype[method],
          method,
          descriptor,
        );
      }
    }
  };
}
