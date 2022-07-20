import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CoreModule } from '@els/server/worker/core';

@Module({
  imports: [CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
