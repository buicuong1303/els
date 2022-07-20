import { Controller, Post, Req, Res, UnauthorizedException } from '@nestjs/common';

import { FastifyRequest, FastifyReply } from 'fastify';
import { AccountService } from '@els/server-guardian-account-data-access-services';

@Controller()
export class AccountController {
  constructor(private readonly _accountService: AccountService) {}
  
  @Post('/authenticate')
  async authenticate(@Req() req: FastifyRequest, @Res() res: FastifyReply ) {
    const authToken: string = req.body['headers']['Authorization'] || req.body['headers']['authorization'];
    if (authToken && authToken.startsWith('Bearer '))  {
      try {
        const sessionToken = authToken.slice(7);
        const identity = await this._accountService.whoami(sessionToken);
        const hasuraVariables = {
          'X-Hasura-Role': 'user',  // result.role
          'X-Hasura-Identity-Id': identity.id    // result.user_id
        };
        res.status(200).send(hasuraVariables);
        return;
      } catch (error) {
        throw new UnauthorizedException();
      }
    } 
    throw new UnauthorizedException();

  }


}
