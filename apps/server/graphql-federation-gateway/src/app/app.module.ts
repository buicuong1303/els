import { Module } from '@nestjs/common';
import { CoreModule } from '@els/server/graphql-federation-gateway/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
