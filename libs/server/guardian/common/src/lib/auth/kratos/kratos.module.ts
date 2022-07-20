import { Module } from '@nestjs/common';
import { KratosService } from './kratos.service';

@Module({
  providers: [
    KratosService,
  ],
  exports: [
    KratosService,
  ]
})
export class KratosModule {}
