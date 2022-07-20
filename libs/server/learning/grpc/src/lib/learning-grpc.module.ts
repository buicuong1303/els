import { Module } from '@nestjs/common';
import { LearningGrpcService } from './learning-grpc.service';
import { UserModule } from '@els/server/learning/user/feature';
import { RankModule } from '@els/server/learning/rank/feature';


@Module({
  imports: [UserModule, RankModule],
  controllers: [LearningGrpcService]
})
export class LearningGrpcModule {}
