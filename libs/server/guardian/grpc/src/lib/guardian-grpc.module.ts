import { Module } from '@nestjs/common';
import { GuardianGrpcService } from './guardian-grpc.service';
import { AccountModule } from '@els/server-guardian-account-feature';


@Module({
  imports: [AccountModule],
  controllers: [GuardianGrpcService]
})
export class GuardianGrpcModule {}
