/* eslint-disable @typescript-eslint/no-unused-vars */
import { GqlContext } from '@els/server/learning/common';
import { RankService } from '@els/server/learning/rank/data-access/services';
import { UserService } from '@els/server/learning/user/data-access/services';
import { protobuf } from '@els/server/shared';
import { Controller, Logger } from '@nestjs/common';
import { Context } from '@nestjs/graphql';
import { Metadata } from 'grpc';
@protobuf.LEARNING.LearningServiceControllerMethods()
@Controller()
export class LearningGrpcService implements protobuf.LEARNING.LearningServiceController {
  private readonly _logger = new Logger(LearningGrpcService.name);

  constructor(
    private readonly _userService: UserService,
    private readonly _rankService: RankService
  ) {}
  async createUser(request: protobuf.LEARNING.CreateUserRequest, metadata: Metadata, ...rest: any): Promise<protobuf.LEARNING.CreateUserResponse> {
    return this._userService.createUserWebhook(request.identityId);
  }

  async updateRank(request: any, metadata: Metadata, ...rest: any): Promise<any> {
    // return this._rankService.updateRank();
  }

  async updateUser(request: protobuf.LEARNING.UpdateUserRequest, metadata: Metadata, ...rest: any): Promise<protobuf.LEARNING.UpdateUserResponse> {
    return null;
  }
}
