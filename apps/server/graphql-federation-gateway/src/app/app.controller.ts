import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
  @Get('/link-social-network')
  notify(@Res({ passthrough: true }) response: Response) {
    const cookie = `test=abc; Domain=${process.env.WILDCARD_DOMAIN}; Path=/; HttpOnly; SameSite=Lax`;
    response.header('Set-Cookie', cookie );
    // response.cookie('cookieName', 'test', {domain: '.els.com', maxAge: 900000, httpOnly: true, sameSite: 'lax' });
    return 'success';
  }
}
