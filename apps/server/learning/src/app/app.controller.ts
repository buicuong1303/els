import { MinIoService } from '@els/server/shared';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(
    private readonly _appService: AppService,
    private readonly _minIoService: MinIoService,
  ) {}

  @Get()
  getData() {
    return this._appService.getData();
  }

  // @Get('/presigned')
  // presignedUrl(@Query('fileName') fileName: string) {
  //   return this._minIoService.getPresignedUrl(fileName);
  // }
}
