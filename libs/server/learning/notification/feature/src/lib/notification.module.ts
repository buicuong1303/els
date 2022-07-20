import { forwardRef, Module } from '@nestjs/common';
import { NotificationService } from '@els/server/learning/notification/data-access/services';
import { AmqpModule } from '@els/server/learning/amqp';
import { NotificationResolver } from './notification.resolver';
import { NotificationMutationsResolver } from './notification-mutations.resolver';
@Module({
  imports: [forwardRef(() => AmqpModule)],
  controllers: [],
  providers: [ NotificationService, NotificationResolver, NotificationMutationsResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
