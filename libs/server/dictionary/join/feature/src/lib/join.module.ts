import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Join } from '@els/server/dictionary/join/data-access/entities';
import { JoinService } from '@els/server/dictionary/join/data-access/services';
@Module({
  imports: [TypeOrmModule.forFeature([Join])],
  controllers: [],
  providers: [JoinService],
  exports: [JoinService],
})
export class JoinModule {};
