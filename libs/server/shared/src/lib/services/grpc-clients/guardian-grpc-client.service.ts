/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  Logger
} from '@nestjs/common';
import { GUARDIAN } from '../../..';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { Metadata } from 'grpc';
import { lastValueFrom } from 'rxjs';
import * as api from '@opentelemetry/api';
import { SemanticAttributes } from '@opentelemetry/semantic-conventions';
import { SpanKind, SpanStatusCode } from '@opentelemetry/api';
import { extractBooleanEnvVar } from '@els/shared/utils';
const baseUrl = 'libs/server/shared/src/lib/protobuf';
const conf = {
  package: 'els.srv.guardian',
  service: 'GuardianService',
  protoPath: join(process.cwd(), `${baseUrl}`, 'guardian.proto'),
  url: `0.0.0.0:${process.env.GRPC_PORT}`, //* inside url for grpc server
  clientUrl: `${process.env.GRPC_GUARDIAN_HOST}:${process.env.GRPC_PORT}`, //* outside url for another service can connect
};

@Injectable()
export class GuardianGrpcServiceClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: conf.clientUrl,
      package: conf.package, //* proto package name define in proto file
      protoPath: conf.protoPath, //* dir to proto file,
    },
  })
  private readonly _client!: ClientGrpc;
  private readonly _logger = new Logger(GuardianGrpcServiceClient.name);

  private _svc!: GUARDIAN.GuardianServiceClient;

  onModuleInit() {
    //* service name define in proto file
    this._svc = this._client.getService<GUARDIAN.GuardianServiceClient>(
      conf.service
    );
  }

  public static GetConfig() {
    return conf;
  }

  async authenticate(
    request: GUARDIAN.AuthenticateRequest,
    metadata?: Metadata,
    ...rest: any
  ): Promise<GUARDIAN.AuthenticateResponse> {
    if (extractBooleanEnvVar('ENABLE_TRACING')) {
      const tracer = api.trace.getTracer('default');
      const span = tracer.startSpan(
        'els.srv.guardian.GuardianService/Authenticate',
        {
          attributes: {
            [SemanticAttributes.RPC_METHOD]: 'Authenticate',
          },
          kind: SpanKind.CLIENT,
        }
      );

      if (request.sessionToken) {
        span.setAttribute('sessionToken', request.sessionToken);
      }
      if (request.sessionCookie?.toString())
        span.setAttribute('sessionCookie', request.sessionCookie?.toString());

      try {
        const account: GUARDIAN.AuthenticateResponse = await lastValueFrom(
          this._svc.authenticate(request)
        );
        span.setAttribute(
          SemanticAttributes.RPC_GRPC_STATUS_CODE,
          SpanStatusCode.OK
        );
        return account;
      } catch (error) {
        span.setAttribute(
          SemanticAttributes.RPC_GRPC_STATUS_CODE,
          SpanStatusCode.ERROR
        );
        throw new InternalServerErrorException('Can not authenticate');
      } finally {
        span.end();
      }
    } else {
      try {
        const account: GUARDIAN.AuthenticateResponse = await lastValueFrom(
          this._svc.authenticate(request)
        );
        return account;
      } catch (error) {
        throw new InternalServerErrorException('Can not authenticate');
      }
    }
  }

  async getIdentity(
    request: GUARDIAN.GetIdentityRequest,
    metadata?: Metadata,
    ...rest: any
  ): Promise<GUARDIAN.GetIdentityResponse> {
    if (extractBooleanEnvVar('ENABLE_TRACING')) {
      const tracer = api.trace.getTracer('default');
      const span = tracer.startSpan(
        'els.srv.guardian.GuardianService/GetIdentity`',
        {
          attributes: {
            [SemanticAttributes.RPC_METHOD]: 'GetIdentity',
          },
          kind: SpanKind.CLIENT,
        }
      );

      try {
        const identity: GUARDIAN.GetIdentityResponse = await lastValueFrom(
          this._svc.getIdentity(request)
        );
        span.setAttribute(
          SemanticAttributes.RPC_GRPC_STATUS_CODE,
          SpanStatusCode.OK
        );
        return identity;
      } catch (error) {
        span.setAttribute(
          SemanticAttributes.RPC_GRPC_STATUS_CODE,
          SpanStatusCode.ERROR
        );
        this._logger.error(error);
        throw new InternalServerErrorException('Can not get identity');
      } finally {
        span.end();
      }
    } else {
      try {
        const identity: GUARDIAN.GetIdentityResponse = await lastValueFrom(
          this._svc.getIdentity(request)
        );
        return identity;
      } catch (error) {
        this._logger.error(error);
        throw new InternalServerErrorException('Can not get identity');
      }
    }
  }

  async getIdentities(
    metadata?: Metadata,
    ...rest: any
  ): Promise<GUARDIAN.GetIdentitiesResponse> {
    if (extractBooleanEnvVar('ENABLE_TRACING')) {
      const tracer = api.trace.getTracer('default');
      const span = tracer.startSpan(
        'els.srv.guardian.GuardianService/GetIdentities',
        {
          attributes: {
            [SemanticAttributes.RPC_METHOD]: 'GetIdentities',
          },
          kind: SpanKind.CLIENT,
        }
      );

      try {
        const identities: GUARDIAN.GetIdentitiesResponse = await lastValueFrom(
          this._svc.getIdentities()
        );
        span.setAttribute(
          SemanticAttributes.RPC_GRPC_STATUS_CODE,
          SpanStatusCode.OK
        );
        return identities;
      } catch (error) {
        span.setAttribute(
          SemanticAttributes.RPC_GRPC_STATUS_CODE,
          SpanStatusCode.ERROR
        );
        this._logger.error(error);
        throw new InternalServerErrorException('Can not get identities');
      } finally {
        span.end();
      }
    } else {
      try {
        const identities: GUARDIAN.GetIdentitiesResponse = await lastValueFrom(
          this._svc.getIdentities()
        );
        return identities;
      } catch (error) {
        this._logger.error(error);
        throw new InternalServerErrorException('Can not get identities');
      }
    }
  }
}
