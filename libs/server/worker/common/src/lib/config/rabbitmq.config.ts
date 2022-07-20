import { MessageHandlerErrorBehavior } from '@golevelup/nestjs-rabbitmq';
import { ConfigModule } from '@nestjs/config';
export default class RabbitMqConfig {
  static getRabbitMqConfig() {
    return {
      defaultRpcErrorBehavior: MessageHandlerErrorBehavior.NACK,
      defaultSubscribeErrorBehavior: MessageHandlerErrorBehavior.NACK,
      exchanges: [
        {
          name: 'phpswteam.english_learning_system',
          type: 'topic',
        },
      ],

      //* amqp://{username}:{password}@{host}:{port}
      uri: `amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`,
      connectionInitOptions: { wait: false },
    };
  }
}
export const rabbitMqConfigAsync = {
  imports: [ConfigModule],
  useFactory: async () => RabbitMqConfig.getRabbitMqConfig(),
};
