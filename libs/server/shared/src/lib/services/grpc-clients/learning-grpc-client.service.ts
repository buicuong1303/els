import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { LEARNING } from '../../..';
import { Client, ClientGrpc, Transport } from '@nestjs/microservices';
import { join } from 'path';

const baseUrl = 'libs/server/shared/src/lib/protobuf';
const conf = {
  package: 'els.srv.learning',
  service: 'LearningService',
  protoPath: join(process.cwd(), `${baseUrl}`, 'learning.proto'),
  url: `0.0.0.0:${process.env.GRPC_PORT}`, //* inside url for grpc server
  clientUrl: `${process.env.GRPC_LEARNING_HOST}:${process.env.GRPC_PORT}` //* outside url for another service can connect
};

@Injectable()
export class LearningGrpcServiceClient implements OnModuleInit {
  @Client({
    transport: Transport.GRPC,
    options: {
      url: conf.clientUrl,
      package: conf.package, //* proto package name define in proto file
      protoPath: conf.protoPath, //* dir to proto file,
    },
  })
  private readonly _client!: ClientGrpc;
  private readonly _logger = new Logger(LearningGrpcServiceClient.name);

  private _svc!: LEARNING.LearningServiceClient;

  onModuleInit() {
    //* service name define in proto file
    this._svc = this._client.getService<LEARNING.LearningServiceClient>(conf.service);
  }

  public get svc(): LEARNING.LearningServiceClient {
    if (!this._svc) throw new Error('LearningServiceClient not initialized');
    return this._svc;
  }

  public static GetConfig() {
    return conf;
  }
}
