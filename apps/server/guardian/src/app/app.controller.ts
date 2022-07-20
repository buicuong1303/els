import { Controller, Get, Post, Req, Res } from '@nestjs/common';

import { AppService } from './app.service';
import { FastifyRequest, FastifyReply } from 'fastify';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData(@Req() req: FastifyRequest ) {
    console.log(req);
    return this.appService.getData();
  }

  @Get('/setting')
  setting(@Req() req: FastifyRequest ) {
    console.log(req);
    return '/setting';
  }

  @Get('/verification')
  verification(@Req() req: FastifyRequest ) {
    console.log(req);
    return '/verification';
  }

  @Get('/recovery')
  recovery(@Req() req: FastifyRequest) {
    console.log(req);
    return '/recovery';
  }

  @Get('/logout')
  logout() {
    return '/logout';
  }

  @Post('/login')
  login(@Req() req: FastifyRequest, @Res() res: FastifyReply ) {
    console.log('authen');
    const authToken: string = req.body['headers']['Authorization'];
    if (authToken && authToken.startsWith('Bearer '))  {
      const sessionToken = authToken.slice(7);
      console.log(sessionToken);
    }
    const hasuraVariables = {
      'X-Hasura-Role': 'user',  // result.role
      'X-Hasura-User-Id': '1'    // result.user_id
    };
    res.status(200).send(hasuraVariables);
    return;
  }

  @Get('/registration')
  registration(@Req() req: FastifyRequest ) {
    console.log(req);
    return '/registration';
  }
}
