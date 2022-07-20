/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { UserService } from '@els/server/learning/user/data-access/services';
import { RedisCacheService } from '@els/server/shared';
import {
  BadRequestException, Body,
  Controller,
  ForbiddenException, Post,
  Req
} from '@nestjs/common';
import { Request } from 'express';
@Controller('users')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _redisCacheService: RedisCacheService,
  ) {}

  @Post('/callback')
  createUser(@Body('identity') identity: any, @Req() req: Request) {
    if (!req.headers.authorization) throw new ForbiddenException();
    const code = req.headers.authorization.slice(6);
    const buff = Buffer.from(code, 'base64');
    const [username, password] = buff.toString('ascii').split(':');
    //TODO parameterize
    if (username !== process.env.BASIC_AUTH_USERNAME || password !== process.env.BASIC_AUTH_PASSWORD)
      throw new ForbiddenException();
    if (identity?.id) {
      this._redisCacheService.set('key', 'value');
      return this._userService.createUserWebhook(identity.id);
    }
    throw new BadRequestException();
  }

}
